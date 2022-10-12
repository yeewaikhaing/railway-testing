import { StoreService as MedusaStoreService } from '@medusajs/medusa/dist/services';
import { EntityManager } from 'typeorm';
import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency';
import { Store } from '../entities/store.entity';
import { EntityEventType, Service, MedusaEventHandlerParams, OnMedusaEntityEvent } from 'medusa-extender';
import { User } from '../../user/entities/user.entity';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import StoreRepository from '../repositories/store.repository';
import { Invite } from '../../invite/invite.entity';
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import {buildQuery} from "@medusajs/medusa/dist/utils";
import { MedusaError } from 'medusa-core-utils';
import { CreateStoreInput } from '../types/store';

interface ConstructorParams {
    loggedInUser?: User;
    manager: EntityManager;
    storeRepository: typeof StoreRepository;
    currencyRepository: typeof CurrencyRepository;
    eventBusService: EventBusService;
}

@Service({ override: MedusaStoreService, scope: 'SCOPED' })
export default class StoreService extends MedusaStoreService {
    static resolutionKey = 'storeService';

    private readonly manager: EntityManager;
    private readonly storeRepository: typeof StoreRepository;

    constructor(private readonly container: ConstructorParams) {
        super(container);
        this.manager = container.manager;
        this.storeRepository = container.storeRepository;
    }
    /**
   * Creates a store if it doesn't already exist.
   * @return The store.
   */
  async createStore(storeObject: CreateStoreInput): Promise<Store> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepository = transactionManager.getCustomRepository(
          this.storeRepository
        )
        const currencyRepository = transactionManager.getCustomRepository(
          this.currencyRepository_
        )

        let newStore = storeRepository.create(storeObject);
        
        // Add default currency (USD) to store currencies
        const usd = await currencyRepository.findOne({
          code: "usd",
        })

        if (usd) {
          newStore.currencies = [usd]
        }

        newStore = await storeRepository.save(newStore)
        return newStore;
      }
    )
  }
   /**
   * Retrieve the store settings. There is always a maximum of one store.
   * @param config The config object from which the query will be built
   * @return the store
   */
  async retrieveById(store_id: string,config: FindConfig<Store> = {}): Promise<Store> {

    const storeRepo = this.manager.getCustomRepository(this.storeRepository)
    const query = buildQuery({ id: store_id }, config)
    
    const store = await storeRepo.findOne(query)

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store does not exist")
    }

    return store
  }


    //@OnMedusaEntityEvent.Before.Insert(User, { async: true })
    public async createStoreForNewUser(
        params: MedusaEventHandlerParams<User, 'Insert'>
    ): Promise<EntityEventType<User, 'Insert'>> {
        const { event } = params;
        let store_id = Object.keys(this.container).includes("loggedInUser")
        ? this.container.loggedInUser.store_id
        : null;
        if (!store_id) {
            const createdStore = await this.withTransaction(event.manager).createForUser(event.entity);
            if (!!createdStore) {
                store_id = createdStore.id;
            }
        }

        event.entity.store_id = store_id;

        return event;
    }
    //@OnMedusaEntityEvent.Before.Insert(Invite, { async: true })
    public async addStoreToInvite(
        params: MedusaEventHandlerParams<Invite, 'Insert'>
    ): Promise<EntityEventType<Invite, 'Insert'>> {
        const { event } = params; //invite to be created is in event.entity
        let store_id = this.container.loggedInUser.store_id
    
        if (!event.entity.store_id && store_id) {
            event.entity.store_id = store_id;
        }
    
        return event;
    }
    
    public async createForUser(user: User): Promise<Store | void> {
        if (user.store_id) {
            return;
        }
        const storeRepo = this.manager.getCustomRepository(this.storeRepository);
        const store = storeRepo.create() as Store;
        return storeRepo.save(store);
    }

    public async customRetrieve(relations: string[] = [], config: FindConfig<Store> = {}) {
        if (!Object.keys(this.container).includes('loggedInUser')) {
            //return super.retrieve(config);
        }

        const storeRepo = this.manager.getCustomRepository(this.storeRepository);
        const store = await storeRepo.findOne({
            relations,
            join: { alias: 'store', innerJoin: { members: 'store.members' } },
            where: (qb) => {
                qb.where('members.id = :memberId', { memberId: this.container.loggedInUser.id });
            },
        });

        if (!store) {
            throw new Error('Unable to find the user store');
        }

        return store;
    }
}