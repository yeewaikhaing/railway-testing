import { StoreService as MedusaStoreService } from '@medusajs/medusa/dist/services';
import { EntityManager } from 'typeorm';
import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency';
import { Store } from '../entities/store.entity';
import { EntityEventType, MedusaEventHandlerParams } from 'medusa-extender';
import { User } from '../../user/entities/user.entity';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import StoreRepository from '../repositories/store.repository';
import { Invite } from '../../invite/invite.entity';
import { FindConfig } from "@medusajs/medusa/dist/types/common";
interface ConstructorParams {
    loggedInUser?: User;
    manager: EntityManager;
    storeRepository: typeof StoreRepository;
    currencyRepository: typeof CurrencyRepository;
    eventBusService: EventBusService;
}
export default class StoreService extends MedusaStoreService {
    private readonly container;
    private readonly manager;
    private readonly storeRepository;
    constructor(container: ConstructorParams);
    /**
    * Retrieve the store settings. There is always a maximum of one store.
    * @param config The config object from which the query will be built
    * @return the store
    */
    retrieveById(store_id: string, config?: FindConfig<Store>): Promise<Store>;
    createStoreForNewUser(params: MedusaEventHandlerParams<User, 'Insert'>): Promise<EntityEventType<User, 'Insert'>>;
    addStoreToInvite(params: MedusaEventHandlerParams<Invite, 'Insert'>): Promise<EntityEventType<Invite, 'Insert'>>;
    createForUser(user: User): Promise<Store | void>;
    customRetrieve(relations?: string[], config?: FindConfig<Store>): Promise<Store>;
}
export {};
