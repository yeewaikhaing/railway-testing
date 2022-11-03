import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
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
    TotalsService } from "@medusajs/medusa/dist/services";
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
    private readonly cartRepo: typeof CartRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.cartRepo = container.cartRepository;
    }
}