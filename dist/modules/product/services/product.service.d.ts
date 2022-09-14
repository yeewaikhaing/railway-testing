import { EntityEventType, MedusaEventHandlerParams } from 'medusa-extender';
import { ProductService as MedusaProductService } from '@medusajs/medusa/dist/services';
import { Product } from '../entities/product.entity';
import { User } from '../../user/entities/user.entity';
import UserService from '../../user/services/user.service';
declare type ConstructorParams = {
    manager: any;
    loggedInUser?: User;
    productRepository: any;
    productVariantRepository: any;
    productOptionRepository: any;
    eventBusService: any;
    productVariantService: any;
    productCollectionService: any;
    productTypeRepository: any;
    productTagRepository: any;
    imageRepository: any;
    searchService: any;
    userService: UserService;
    cartRepository: any;
    priceSelectionStrategy: any;
};
export declare class ProductService extends MedusaProductService {
    #private;
    private readonly container;
    constructor(container: ConstructorParams);
    attachStoreToProduct(params: MedusaEventHandlerParams<Product, 'Insert'>): Promise<EntityEventType<Product, 'Insert'>>;
    prepareListQuery_(selector: object, config: object): object;
}
export {};
