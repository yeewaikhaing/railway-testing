import { Product as MedusaProduct } from '@medusajs/medusa/dist';
import { Store } from '../../store/entities/store.entity';
export declare class Product extends MedusaProduct {
    store_id: string;
    store: Store;
}
