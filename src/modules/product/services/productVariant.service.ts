import { IPriceSelectionStrategy } from '@medusajs/medusa/dist/interfaces/price-selection-strategy';
import { ProductVariantService as MedusaProductVariantService } from '@medusajs/medusa/dist/services';
      import { Service } from 'medusa-extender';
      import { EntityManager } from 'typeorm';
import {ProductRepository} from '../repositories/product.repository';
//  import { Product } from '../entities/product.entity';
//  import { ProductVariant } from '@medusajs/medusa/dist/models/product-variant';
// import { CreateProductVariantInput } from '../types/product-variant';
// import { MedusaError } from "medusa-core-utils";

type InjectedDependencies = {
    manager: EntityManager;
    productVariantRepository,
    productRepository: typeof ProductRepository;
    eventBusService: any;
    regionService: any
    moneyAmountRepository: any
    productOptionValueRepository: any
    cartRepository: any
    priceSelectionStrategy: IPriceSelectionStrategy
};
      
@Service({override: MedusaProductVariantService})
export class ProductVariantService extends MedusaProductVariantService {
    static resolutionKey = 'productVariantService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.container = container;
    }

   

}