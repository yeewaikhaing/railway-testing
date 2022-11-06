import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import MedusaLineItemService  from '@medusajs/medusa/dist/services/line-item';
import { LineItemRepository } from "../repositories/lineItem.repository";
import { CartRepository } from "../../cart/repositories/cart.repository";
import { ProductVariantService } from "../../product/services/productVariant.service";
import { ProductService } from "../../product/services/product.service";
import { PricingService } from "../../product/services/pricing.service";
import { RegionService } from "../../region/services/region.service";
import LineItemAdjustmentService from "@medusajs/medusa/dist/services/line-item-adjustment";
import  TaxProviderService  from "@medusajs/medusa/dist/services/tax-provider";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { LineItemTaxLineRepository } from "../repositories/lineItemTaxLine.repository";
import { LineItem } from "../entities/lineItem.entity";
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { buildQuery, setMetadata } from "@medusajs/medusa/dist/utils"
import { MedusaError } from "medusa-core-utils";
import { Cart } from '../../cart/entities/cart.entity';
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing"
import OrderEditingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/order-editing"
import { LineItemAdjustment } from '@medusajs/medusa/dist/models/line-item-adjustment';

type InjectedDependencies = {
    manager: EntityManager
    lineItemRepository: typeof LineItemRepository
    lineItemTaxLineRepository: typeof LineItemTaxLineRepository
    cartRepository: typeof CartRepository
    productVariantService: ProductVariantService
    productService: ProductService
    pricingService: PricingService
    regionService: RegionService
    lineItemAdjustmentService: LineItemAdjustmentService
    taxProviderService: TaxProviderService
    featureFlagRouter: FlagRouter
  }

@Service({override: MedusaLineItemService})
export class LineItemService extends MedusaLineItemService {
    static resolutionKey = 'lineItemService';

    private readonly manager: EntityManager;
    private readonly lineItemRepository: typeof LineItemRepository;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.lineItemRepository = container.lineItemRepository;
    }

    /**
   * Create a line item
   * @param data - the line item object to create
   * @return the created line item
   */
  async create(data: Partial<LineItem>): Promise<LineItem> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository
        )

        const lineItem = lineItemRepository.create(data)
        return await lineItemRepository.save(lineItem)
      }
    )
  }
    async generate(
      variantId: string,
      regionId: string,
      quantity: number,
      context: {
        unit_price?: number
        includes_tax?: boolean
        metadata?: Record<string, unknown>
        customer_id?: string
        order_edit_id?: string
        cart?: Cart
      } = {}
    ): Promise<LineItem> {
      return await this.atomicPhase_(
        async (transactionManager: EntityManager) => {
          const [variant, region] = await Promise.all([
            this.container.productVariantService
              .withTransaction(transactionManager)
              .retrieve(variantId, {
                relations: ["product"],
              }),
            this.container.regionService
              .withTransaction(transactionManager)
              .retrieve(regionId),
          ])
  
          let unit_price = Number(context.unit_price) < 0 ? 0 : context.unit_price
  
          let unitPriceIncludesTax = false
  
          let shouldMerge = false
  
          if (context.unit_price === undefined || context.unit_price === null) {
            shouldMerge = true
            const variantPricing = await this.pricingService_
              .withTransaction(transactionManager)
              .getProductVariantPricingById(variant.id, {
                region_id: region.id,
                quantity: quantity,
                customer_id: context?.customer_id,
                include_discount_prices: true,
              })
  
            unitPriceIncludesTax = !!variantPricing.calculated_price_includes_tax
  
            unit_price = variantPricing.calculated_price ?? undefined
          }
  
          const rawLineItem: Partial<LineItem> = {
            unit_price: unit_price,
            title: variant.product.title,
            description: variant.title,
            thumbnail: variant.product.thumbnail,
            variant_id: variant.id,
            quantity: quantity || 1,
            allow_discounts: variant.product.discountable,
            is_giftcard: variant.product.is_giftcard,
            metadata: context?.metadata || {},
            should_merge: shouldMerge,
          }
  
          if (
            this.featureFlagRouter_.isFeatureEnabled(
              TaxInclusivePricingFeatureFlag.key
            )
          ) {
            rawLineItem.includes_tax = unitPriceIncludesTax
          }
  
          if (
            this.featureFlagRouter_.isFeatureEnabled(OrderEditingFeatureFlag.key)
          ) {
            rawLineItem.order_edit_id = context.order_edit_id || null
          }
  
          const lineItemRepo = transactionManager.getCustomRepository(
            this.lineItemRepository
          )
          const lineItem = lineItemRepo.create(rawLineItem)
  
          if (context.cart) {
            const adjustments = await this.lineItemAdjustmentService_
              .withTransaction(transactionManager)
              .generateAdjustments(context.cart, lineItem, { variant })
            lineItem.adjustments = adjustments as unknown as LineItemAdjustment[]
          }
  
          return lineItem
        }
      )
    }
  
    async list(
        selector: Selector<LineItem>,
        config: FindConfig<LineItem> = {
          skip: 0,
          take: 50,
          order: { created_at: "DESC" },
        }
      ): Promise<LineItem[]> {
        const manager = this.manager
        const lineItemRepo = manager.getCustomRepository(this.lineItemRepository)
        const query = buildQuery(selector, config)
        return await lineItemRepo.find(query)
      }
 
      /**
   * Deletes a line item.
   * @param id - the id of the line item to delete
   * @return the result of the delete operation
   */
  async delete(id: string): Promise<LineItem | undefined> {
    const manager = this.manager
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepository = transactionManager.getCustomRepository(this.lineItemRepository);

        return await lineItemRepository
          .findOne({ where: { id } })
          .then((lineItem) => lineItem && lineItemRepository.remove(lineItem))
      }
    )
  }

  /**
   * Updates a line item
   * @param idOrSelector - the id or selector of the line item(s) to update
   * @param data - the properties to update the line item(s)
   * @return the updated line item(s)
   */
   async update(
    idOrSelector: string | Selector<LineItem>,
    data: Partial<LineItem>
  ): Promise<LineItem[]> {
    const { metadata, ...rest } = data

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItemRepo = transactionManager.getCustomRepository(this.lineItemRepository);

        const selector = typeof idOrSelector === "string" ? { id: idOrSelector } : idOrSelector

        let lineItems = await this.list(selector)
        
        if (!lineItems.length) {
          const selectorConstraints = Object.entries(selector)
            .map(([key, value]) => `${key}: ${value}`)
            .join(", ")

          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Line item with ${selectorConstraints} was not found`
          )
        }

        lineItems = lineItems.map((item) => {
          const lineItemMetadata = metadata
            ? setMetadata(item, metadata)
            : item.metadata

          return Object.assign(item, {
            ...rest,
            metadata: lineItemMetadata,
          })
        })

        return await lineItemRepo.save(lineItems)
      }
    )
  }

}