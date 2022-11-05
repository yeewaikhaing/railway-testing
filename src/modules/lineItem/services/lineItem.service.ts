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