
import { IPriceSelectionStrategy } from "@medusajs/medusa/dist/interfaces/price-selection-strategy";
import { ProductVariantService, RegionService, TaxProviderService } from "@medusajs/medusa/dist/services";
import { default as MesusaPricingService } from "@medusajs/medusa/dist/services/pricing";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';

type InjectedDependencies = {
    manager: EntityManager;
    productVariantService: ProductVariantService
    taxProviderService: TaxProviderService
    regionService: RegionService
    priceSelectionStrategy: IPriceSelectionStrategy
    featureFlagRouter: FlagRouter
};

@Service({override: MesusaPricingService})
export class PricingService extends MesusaPricingService {
    static resolutionKey = 'pricingService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    constructor( container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.manager = container.manager;
        this.container = container;
    }
}