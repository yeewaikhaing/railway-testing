import { StoreService as MedusaStoreService } from '@medusajs/medusa/dist/services';
import { EntityManager } from 'typeorm';
import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency';
import { Store } from '../entities/store.entity';
import { EntityEventType, MedusaEventHandlerParams } from 'medusa-extender';
import { User } from '../../user/entities/user.entity';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import StoreRepository from '../repositories/store.repository';
import { Invite } from '../../invite/invite.entity';
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
    withTransaction(transactionManager: EntityManager): StoreService;
    createStoreForNewUser(params: MedusaEventHandlerParams<User, 'Insert'>): Promise<EntityEventType<User, 'Insert'>>;
    addStoreToInvite(params: MedusaEventHandlerParams<Invite, 'Insert'>): Promise<EntityEventType<Invite, 'Insert'>>;
    createForUser(user: User): Promise<Store | void>;
    retrieve(relations?: string[]): Promise<any>;
}
export {};
