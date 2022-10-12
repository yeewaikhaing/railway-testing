import { StoreRepository as MedusaStoreRepository } from '@medusajs/medusa/dist/repositories/store';
import { Store } from '../entities/store.entity';
declare const StoreRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<Store>, MedusaStoreRepository>;
export default class StoreRepository extends StoreRepository_base {
}
export {};
