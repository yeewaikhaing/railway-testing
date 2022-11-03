import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager, DeepPartial } from 'typeorm';
import { CartRepository } from "../repositories/cart.repository";
import { ShippingMethodRepository } from "@medusajs/medusa/dist/repositories/shipping-method";
import { AddressRepository } from "../../customer/v1/repositories/address.repository";
import { PaymentSessionRepository } from "@medusajs/medusa/dist/repositories/payment-session";
import { LineItemRepository } from "../../lineItem/repositories/lineItem.repository";
import { 
    CustomShippingOptionService, 
    EventBusService, 
    GiftCardService, 
    InventoryService,  
    PaymentProviderService, 
    SalesChannelService, 
    ShippingOptionService, 
    TaxProviderService, 
 } from "@medusajs/medusa/dist/services";
import { IPriceSelectionStrategy } from "@medusajs/medusa/dist/interfaces";
import { ProductService } from "../../product/services/product.service";
import StoreService from "../../store/services/store.service";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { ProductVariantService } from "../../product/services/productVariant.service";
import { RegionService } from "../../region/services/region.service";
import { LineItemService } from "../../lineItem/services/lineItem.service";
import { CustomerService } from "../../customer/v1/services/customer.service";
import { DiscountService } from "../../discount/services/discount.service";
import LineItemAdjustmentService from "@medusajs/medusa/dist/services/line-item-adjustment";
import { default as MedusaCartService } from '@medusajs/medusa/dist/services/cart';
import { CartCreateProps } from "../types/cart";
import { Cart } from "../entities/cart.entity";
import { buildQuery, isDefined, setMetadata } from "@medusajs/medusa/dist/utils"
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { TotalsService } from './totals.service';

type TotalsConfig = {
    force_taxes?: boolean
  }

type InjectedDependencies = {
    manager: EntityManager
    cartRepository: typeof CartRepository
    shippingMethodRepository: typeof ShippingMethodRepository
    addressRepository: typeof AddressRepository
    paymentSessionRepository: typeof PaymentSessionRepository
    lineItemRepository: typeof LineItemRepository
    eventBusService: EventBusService
    salesChannelService: SalesChannelService
    taxProviderService: TaxProviderService
    paymentProviderService: PaymentProviderService
    productService: ProductService
    storeService: StoreService
    featureFlagRouter: FlagRouter
    productVariantService: ProductVariantService
    regionService: RegionService
    lineItemService: LineItemService
    shippingOptionService: ShippingOptionService
    customerService: CustomerService
    discountService: DiscountService
    giftCardService: GiftCardService
    totalsService: TotalsService
    inventoryService: InventoryService
    customShippingOptionService: CustomShippingOptionService
    lineItemAdjustmentService: LineItemAdjustmentService
    priceSelectionStrategy: IPriceSelectionStrategy
  }

@Service({override: MedusaCartService})
export class CartService extends MedusaCartService {
    static resolutionKey = 'cartService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly cartRepository: typeof CartRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.cartRepository = container.cartRepository;
    }

    async retrieveWithTotals(
        cartId: string,
        options: FindConfig<Cart> = {},
        totalsConfig: TotalsConfig = {}
      ): Promise<Cart> {
        const relations = this.myGetTotalsRelations(options)
    
        const cart = await this.myRetrieveNew(cartId, {
          ...options,
          relations,
        })
    
        return await this.decorateTotals(cart, totalsConfig)
    }

    async decorateTotals(cart: Cart, totalsConfig?: TotalsConfig): Promise<Cart> {
        const totalsService = this.container.totalsService
    
        const calculationContext = await totalsService.getCalculationContext(cart, {
          exclude_shipping: true,
        })
    
        cart.items = await Promise.all(
          (cart.items || []).map(async (item) => {
            const itemTotals = await totalsService.myGetLineItemTotals(item, cart, 
            {
              include_tax: totalsConfig?.force_taxes || cart.region.automatic_taxes,
              calculation_context: calculationContext,
            }
            )
    
            return Object.assign(item, itemTotals)
          })
        )
    
        cart.shipping_methods = await Promise.all(
          (cart.shipping_methods || []).map(async (shippingMethod) => {
            const shippingTotals = await totalsService.myGetShippingMethodTotals(
              shippingMethod,
              cart,
              {
                include_tax:
                  totalsConfig?.force_taxes || cart.region.automatic_taxes,
                calculation_context: calculationContext,
              }
            )
    
            return Object.assign(shippingMethod, shippingTotals)
          })
        )
    
        cart.shipping_total = cart.shipping_methods.reduce((acc, method) => {
          return acc + (method.subtotal ?? 0)
        }, 0)
    
        cart.subtotal = cart.items.reduce((acc, item) => {
          return acc + (item.subtotal ?? 0)
        }, 0)
    
        cart.discount_total = cart.items.reduce((acc, item) => {
          return acc + (item.discount_total ?? 0)
        }, 0)
    
        cart.item_tax_total = cart.items.reduce((acc, item) => {
          return acc + (item.tax_total ?? 0)
        }, 0)
    
        cart.shipping_tax_total = cart.shipping_methods.reduce((acc, method) => {
          return acc + (method.tax_total ?? 0)
        }, 0)
    
        const giftCardTotal = await totalsService.getGiftCardTotal(cart, {
          gift_cardable: cart.subtotal - cart.discount_total,
        })
        cart.gift_card_total = giftCardTotal.total || 0
        cart.gift_card_tax_total = giftCardTotal.tax_total || 0
    
        cart.tax_total = cart.item_tax_total + cart.shipping_tax_total
    
        cart.total =
          cart.subtotal +
          cart.shipping_total +
          cart.tax_total -
          (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)
    
        return cart
      }
    
    private async myRetrieveNew(
        cartId: string,
        options: FindConfig<Cart> = {}
      ): Promise<Cart> {
        const manager = this.manager_
        const cartRepo = manager.getCustomRepository(this.cartRepository)
    
        const query = buildQuery({ id: cartId }, options)
    
        if ((options.select || []).length <= 0) {
          query.select = undefined
        }
    
        const queryRelations = query.relations
        query.relations = undefined
    
        const raw = await cartRepo.findOneWithRelations(queryRelations, query)
    
        if (!raw) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Cart with ${cartId} was not found`
          )
        }
    
        return raw
      }
    
    private myGetTotalsRelations(config: FindConfig<Cart>): string[] {
        const relationSet = new Set(config.relations)
    
        relationSet.add("items")
        relationSet.add("items.tax_lines")
        relationSet.add("items.adjustments")
        relationSet.add("gift_cards")
        relationSet.add("discounts")
        relationSet.add("discounts.rule")
        relationSet.add("shipping_methods")
        relationSet.add("shipping_methods.tax_lines")
        relationSet.add("shipping_address")
        relationSet.add("region")
        relationSet.add("region.tax_rates")
    
        return Array.from(relationSet.values())
      }
    
    /**
   * Creates a cart.
   * @param data - the data to create the cart with
   * @return the result of the create operation
   */
  async create(data: CartCreateProps): Promise<Cart | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepo = transactionManager.getCustomRepository(this.cartRepository);
        const addressRepo = transactionManager.getCustomRepository(
          this.container.addressRepository
        )

        const rawCart: DeepPartial<Cart> = {
          context: data.context ?? {},
        }

        // if (
        //   this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
        // ) {
        //   rawCart.sales_channel_id = (
        //     await this.getValidatedSalesChannel(data.sales_channel_id)
        //   ).id
        // }

        if (data.email) {
          const customer = await this.createOrFetchUserFromEmail_(data.email)
          rawCart.customer = customer
          rawCart.customer_id = customer.id
          rawCart.email = customer.email
        }

        if (!data.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `A region_id must be provided when creating a cart`
          )
        }

        rawCart.region_id = data.region_id
        const region = await this.container.regionService
          .withTransaction(transactionManager)
          .retrieve(data.region_id, {
            relations: ["countries"],
          })
        const regCountries = region.countries.map(({ iso_2 }) => iso_2)

        if (!data.shipping_address && !data.shipping_address_id) {
          if (region.countries.length === 1) {
            rawCart.shipping_address = addressRepo.create({
              country_code: regCountries[0],
            })
          }
        } else {
          if (data.shipping_address) {
            if (!regCountries.includes(data.shipping_address.country_code!)) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address = data.shipping_address
          }
          if (data.shipping_address_id) {
            const addr = await addressRepo.findOne(data.shipping_address_id)
            if (
              addr?.country_code &&
              !regCountries.includes(addr.country_code)
            ) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address_id = data.shipping_address_id
          }
        }

        if (data.billing_address) {
          if (!regCountries.includes(data.billing_address.country_code!)) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Billing country not in region"
            )
          }
          rawCart.billing_address = data.billing_address
        }
        if (data.billing_address_id) {
          const addr = await addressRepo.findOne(data.billing_address_id)
          if (addr?.country_code && !regCountries.includes(addr.country_code)) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Billing country not in region"
            )
          }
          rawCart.billing_address_id = data.billing_address_id
        }

        const remainingFields: (keyof Cart)[] = [
          "context",
          "type",
          "metadata",
          "discounts",
          "gift_cards",
        ]

        for (const remainingField of remainingFields) {
          if (isDefined(data[remainingField]) && remainingField !== "object") {
            const key = remainingField as string
            rawCart[key] = data[remainingField]
          }
        }

        const createdCart = cartRepo.create(rawCart)
        const cart = await cartRepo.save(createdCart)
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.CREATED, {
            id: cart.id,
          })
        return cart
        
      }
    )
  }

}