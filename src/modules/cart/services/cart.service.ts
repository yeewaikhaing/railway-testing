import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager, DeepPartial, In } from 'typeorm';
import { CartRepository } from "../repositories/cart.repository";
import { ShippingMethodRepository } from "../../shipping/repositories/shippingMethod.repository";
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
import { CartCreateProps, CartUpdateProps } from "../types/cart";
import { Cart } from "../entities/cart.entity";
import { buildQuery, isDefined, setMetadata } from "@medusajs/medusa/dist/utils"
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { TotalsService } from './totals.service';
import { LineItem } from '../../lineItem/entities/lineItem.entity';
import { DiscountRuleType } from '@medusajs/medusa';
import { Discount } from '../../discount/entities/discount.entity';
import { ShippingOptionService } from '../../shipping/services/shippingOption.service';

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

    async update(cartId: string, data: CartUpdateProps): Promise<Cart> {
      return await this.atomicPhase_(
        async (transactionManager: EntityManager) => {
          const cartRepo = transactionManager.getCustomRepository(this.cartRepository);
          const relations = [
            "items",
            "shipping_methods",
            "shipping_address",
            "billing_address",
            "gift_cards",
            "customer",
            "region",
            "payment_sessions",
            "region.countries",
            "discounts",
            "discounts.rule",
            "discounts.regions",
          ]
  
          // if (
          //   this.featureFlagRouter_.isFeatureEnabled(
          //     SalesChannelFeatureFlag.key
          //   ) &&
          //   data.sales_channel_id
          // ) {
          //   relations.push("items.variant", "items.variant.product")
          // }
  
          const cart = await this.retrieve(cartId, {
            select: [
              "subtotal",
              "tax_total",
              "shipping_total",
              "discount_total",
              "total",
            ],
            relations,
          })
  
          if (data.customer_id) {
            await this.updateCustomerId_(cart, data.customer_id)
          } else {
            if (isDefined(data.email)) {
              const customer = await this.createOrFetchUserFromEmail_(data.email)
              cart.customer = customer
              cart.customer_id = customer.id
              cart.email = customer.email
            }
          }
  
          if (isDefined(data.customer_id) || isDefined(data.region_id)) {
            await this.updateUnitPrices_(cart, data.region_id, data.customer_id)
          }
  
          if (isDefined(data.region_id)) {
            const shippingAddress =
              typeof data.shipping_address !== "string"
                ? data.shipping_address
                : {}
            const countryCode =
              (data.country_code || shippingAddress?.country_code) ?? null
            await this.setRegion_(cart, data.region_id, countryCode)
          }
  
          const addrRepo = transactionManager.getCustomRepository(
            this.addressRepository_
          )
  
          const billingAddress = data.billing_address_id ?? data.billing_address
          if (billingAddress !== undefined) {
            await this.updateBillingAddress_(cart, billingAddress, addrRepo)
          }
  
          const shippingAddress =
            data.shipping_address_id ?? data.shipping_address
          if (shippingAddress !== undefined) {
            await this.updateShippingAddress_(cart, shippingAddress, addrRepo)
          }
  
          // if (
          //   this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
          // ) {
          //   if (
          //     isDefined(data.sales_channel_id) &&
          //     data.sales_channel_id != cart.sales_channel_id
          //   ) {
          //     await this.onSalesChannelChange(cart, data.sales_channel_id)
          //     cart.sales_channel_id = data.sales_channel_id
          //   }
          // }
  
          if (isDefined(data.discounts)) {
            const previousDiscounts = [...cart.discounts]
            cart.discounts.length = 0
  
            await Promise.all(
              data.discounts.map(async ({ code }) => {
                return this.applyDiscount(cart, code)
              })
            )
            const hasFreeShipping = cart.discounts.some(
              ({ rule }) => rule?.type === DiscountRuleType.FREE_SHIPPING
            )
  
            // if we previously had a free shipping discount and then removed it,
            // we need to update shipping methods to original price
            if (
              previousDiscounts.some(
                ({ rule }) => rule.type === DiscountRuleType.FREE_SHIPPING
              ) &&
              !hasFreeShipping
            ) {
              await this.adjustFreeShipping_(cart, false)
            }
  
            if (hasFreeShipping) {
              await this.adjustFreeShipping_(cart, true)
            }
          }
  
          if ("gift_cards" in data) {
            cart.gift_cards = []
  
            await Promise.all(
              (data.gift_cards ?? []).map(async ({ code }) => {
                return this.applyGiftCard_(cart, code)
              })
            )
          }
  
          if (data?.metadata) {
            cart.metadata = setMetadata(cart, data.metadata)
          }
  
          if ("context" in data) {
            const prevContext = cart.context || {}
            cart.context = {
              ...prevContext,
              ...data.context,
            }
          }
  
          if ("completed_at" in data) {
            cart.completed_at = data.completed_at!
          }
  
          if ("payment_authorized_at" in data) {
            cart.payment_authorized_at = data.payment_authorized_at!
          }
  
          const updatedCart = await cartRepo.save(cart)
  
          if ("email" in data || "customer_id" in data) {
            await this.eventBus_
              .withTransaction(transactionManager)
              .emit(CartService.Events.CUSTOMER_UPDATED, updatedCart.id)
          }
  
          await this.eventBus_
            .withTransaction(transactionManager)
            .emit(CartService.Events.UPDATED, updatedCart)
  
          return updatedCart
        }
      )
    }
  
    /**
   * Ensures shipping total on cart is correct in regards to a potential free
   * shipping discount
   * If a free shipping is present, we set shipping methods price to 0
   * if a free shipping was present, we set shipping methods to original amount
   * @param cart - the the cart to adjust free shipping for
   * @param shouldAdd - flag to indicate, if we should add or remove
   * @return void
   */
  protected async adjustFreeShipping_(
    cart: Cart,
    shouldAdd: boolean
  ): Promise<void> {
   // const transactionManager = this.transactionManager_ ?? this.manager_
   const transactionManager = this.transactionManager_ ?? this.manager

    if (cart.shipping_methods?.length) {
      const shippingMethodRepository = transactionManager.getCustomRepository(
        this.container.shippingMethodRepository
      )

      // if any free shipping discounts, we ensure to update shipping method amount
      if (shouldAdd) {
        await shippingMethodRepository.update(
          {
            id: In(
              cart.shipping_methods.map((shippingMethod) => shippingMethod.id)
            ),
          },
          {
            price: 0,
          }
        )
      } else {
        await Promise.all(
          cart.shipping_methods.map(async (shippingMethod) => {
            // if free shipping discount is removed, we adjust the shipping
            // back to its original amount
            // if shipping option amount is null, we assume the option is calculated
            shippingMethod.price =
              shippingMethod.shipping_option.amount ??
              (await this.container.shippingOptionService.getPrice_(
                shippingMethod.shipping_option,
                shippingMethod.data,
                cart
              ))
            return shippingMethodRepository.save(shippingMethod)
          })
        )
      }
    }
  }

    /**
   * Updates the cart's discounts.
   * If discount besides free shipping is already applied, this
   * will be overwritten
   * Throws if discount regions does not include the cart region
   * @param cart - the cart to update
   * @param discountCode - the discount code
   * @return the result of the update operation
   */
  async applyDiscount(cart: Cart, discountCode: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const discount = await this.container.discountService
          .withTransaction(transactionManager)
          .retrieveByCode(discountCode, { relations: ["rule", "regions"] })

        await this.container.discountService
          .withTransaction(transactionManager)
          .validateDiscountForCartOrThrow(cart, discount)

        const rule = discount.rule

        // if discount is already there, we simply resolve
        if (cart.discounts.find(({ id }) => id === discount.id)) {
          return
        }

        const toParse = [...cart.discounts, discount]

        let sawNotShipping = false
        const newDiscounts = toParse.map((discountToParse) => {
          switch (discountToParse.rule?.type) {
            case DiscountRuleType.FREE_SHIPPING:
              if (discountToParse.rule.type === rule.type) {
                return discount
              }
              return discountToParse
            default:
              if (!sawNotShipping) {
                sawNotShipping = true
                if (rule?.type !== DiscountRuleType.FREE_SHIPPING) {
                  return discount
                }
                return discountToParse
              }
              return null
          }
        })

        cart.discounts = newDiscounts.filter(
          (newDiscount): newDiscount is Discount => {
            return !!newDiscount
          }
        )

        // ignore if free shipping
        if (rule?.type !== DiscountRuleType.FREE_SHIPPING && cart?.items) {
          await this.refreshAdjustments_(cart)
        }
      }
    )
  }

    protected async updateUnitPrices_(
      cart: Cart,
      regionId?: string,
      customer_id?: string
    ): Promise<void> {
      // const transactionManager = this.transactionManager_ ?? this.manager_
      const transactionManager = this.transactionManager_ ?? this.manager
      
      // If the cart contains items, we update the price of the items
      // to match the updated region or customer id (keeping the old
      // value if it exists)
      if (cart.items?.length) {
        const region = await this.container.regionService
          .withTransaction(this.transactionManager_)
          .retrieve(regionId || cart.region_id, {
            relations: ["countries"],
          })
  
        //const lineItemServiceTx = this.lineItemService_.withTransaction(transactionManager)
        const lineItemServiceTx = this.container.lineItemService.withTransaction(transactionManager)
  
        cart.items = (
          await Promise.all(
            cart.items.map(async (item) => {
              const availablePrice = await this.priceSelectionStrategy_
                .withTransaction(transactionManager)
                .calculateVariantPrice(item.variant_id, {
                  region_id: region.id,
                  currency_code: region.currency_code,
                  quantity: item.quantity,
                  customer_id: customer_id || cart.customer_id,
                  include_discount_prices: true,
                })
                .catch(() => undefined)
  
              if (
                availablePrice !== undefined &&
                availablePrice.calculatedPrice !== null
              ) {
                return lineItemServiceTx.update(item.id, {
                  has_shipping: false,
                  unit_price: availablePrice.calculatedPrice,
                })
              } else {
                await lineItemServiceTx.delete(item.id)
                return
              }
            })
          )
        )
          .flat()
          .filter((item): item is LineItem => !!item)
      }
    }
  
    /**
   * Sets the customer id of a cart
   * @param cart - the cart to add email to
   * @param customerId - the customer to add to cart
   * @return the result of the update operation
   */
  protected async updateCustomerId_(
    cart: Cart,
    customerId: string
  ): Promise<void> {
    const customer = await this.container.customerService
      .withTransaction(this.transactionManager_)
      .retrieve(customerId)

    cart.customer = customer
    cart.customer_id = customer.id
    cart.email = customer.email
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
        const addressRepo = transactionManager.getCustomRepository(this.container.addressRepository);

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
console.log("data 1 => ", data);

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
        // end of shipping address

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
      //  console.log("created cart => ", createdCart);
      //  return createdCart;
        
      }
    )
  }

}