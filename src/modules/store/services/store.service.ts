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
import {buildQuery, setMetadata} from "@medusajs/medusa/dist/utils";
import { MedusaError } from 'medusa-core-utils';
import { CreateStoreInput, UpdateStoreInput } from '../types/store';
import { Currency } from '@medusajs/medusa/dist/models/currency';

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
   * Retrieve the store settings. There is always a maximum of one store.
   * @param config The config object from which the query will be built
   * @return the store
   */
  async retrieve(config: FindConfig<Store> = {}): Promise<Store> {
    const manager = this.manager_
    const storeRepo = manager.getCustomRepository(this.storeRepository)
    const query = buildQuery({}, config)
    const store = await storeRepo.findOne(query)

    if (!store) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "Store does not exist")
    }

    return store
  }
  /**
   * Add a currency to the store
   * @param code - 3 character ISO currency code
   * @return result after update
   */
   async addCurrency(code: string): Promise<Store | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const storeRepo = transactionManager.getCustomRepository(
          this.storeRepository
        )
        const currencyRepository = transactionManager.getCustomRepository(
          this.currencyRepository_
        )

        const curr = await currencyRepository.findOne({
          where: { code: code.toLowerCase() },
        })

        if (!curr) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Currency ${code} not found`
          )
        }

        const store = await this.retrieve({ relations: ["currencies"] })

        const doesStoreInclCurrency = store.currencies
          .map((c) => c.code.toLowerCase())
          .includes(curr.code.toLowerCase())
        if (doesStoreInclCurrency) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            `Currency already added`
          )
        }

        store.currencies = [...store.currencies, curr]
        return await storeRepo.save(store)
      }
    )
  }
/**
   * Removes a currency from the store
   * @param code - 3 character ISO currency code
   * @return result after update
   */
 async removeCurrency(code: string): Promise<any> {
  return await this.atomicPhase_(
    async (transactionManager: EntityManager) => {
      const storeRepo = transactionManager.getCustomRepository(
        this.storeRepository
      )
      const store = await this.retrieve({ relations: ["currencies"] })
      const doesCurrencyExists = store.currencies.some(
        (c) => c.code === code.toLowerCase()
      )
      if (!doesCurrencyExists) {
        return store
      }

      store.currencies = store.currencies.filter((c) => c.code !== code)
      return await storeRepo.save(store)
    }
  )
}
/**
   * Updates a store
   * @param data - an object with the update values.
   * @return resolves to the update result.
   */
 async update(data: UpdateStoreInput): Promise<Store> {
  return await this.atomicPhase_(
    async (transactionManager: EntityManager) => {
      const storeRepository = transactionManager.getCustomRepository(
        this.storeRepository
      )
      const currencyRepository = transactionManager.getCustomRepository(
        this.currencyRepository_
      )

      const {
        metadata,
        default_currency_code,
        currencies: storeCurrencies,
        ...rest
      } = data

      const store = await this.retrieve({ relations: ["currencies"] })

      if (metadata) {
        store.metadata = setMetadata(store, metadata)
      }

      if (storeCurrencies) {
        const defaultCurr =
          default_currency_code ?? store.default_currency_code
        const hasDefCurrency = storeCurrencies.find(
          (c) => c.toLowerCase() === defaultCurr.toLowerCase()
        )

        // throw if we are trying to remove a currency from store currently used as default
        if (!hasDefCurrency) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `You are not allowed to remove default currency from store currencies without replacing it as well`
          )
        }

        store.currencies = await Promise.all(
          storeCurrencies.map(async (curr) => {
            const currency = await currencyRepository.findOne({
              where: { code: curr.toLowerCase() },
            })

            if (!currency) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `Currency with code ${curr} does not exist`
              )
            }

            return currency
          })
        )
      }

      if (default_currency_code) {
        const hasDefCurrency = store.currencies.find(
          (c) => c.code.toLowerCase() === default_currency_code.toLowerCase()
        )

        if (!hasDefCurrency) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Store does not have currency: ${default_currency_code}`
          )
        }

        const curr = (await currencyRepository.findOne({
          code: default_currency_code.toLowerCase(),
        })) as Currency

        store.default_currency = curr
        store.default_currency_code = curr.code
      }

      for (const [key, value] of Object.entries(rest)) {
        store[key] = value
      }

      return await storeRepository.save(store)
    }
  )
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