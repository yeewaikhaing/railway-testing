import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaLineItemService } from '@medusajs/medusa/dist/services/line-item';
import { LineItemRepository } from "../repositories/lineItem.repository";
import { CartRepository } from "../../cart/repositories/cart.repository";
import { ProductVariantService } from "../../product/services/productVariant.service";
import { ProductService } from "../../product/services/product.service";
import { PricingService } from "../../product/services/pricing.service";
import { RegionService } from "../../region/services/region.service";
import LineItemAdjustmentService from "@medusajs/medusa/dist/services/line-item-adjustment";
import { TaxProviderService } from "@medusajs/medusa";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { LineItemTaxLineRepository } from "@medusajs/medusa/dist/repositories/line-item-tax-line";

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
    private readonly lineItemRepo: typeof LineItemRepository;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.lineItemRepo = container.lineItemRepository;
    }
}