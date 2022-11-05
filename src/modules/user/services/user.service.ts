import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { UserService as MedusaUserService } from '@medusajs/medusa/dist/services';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
import { MedusaError } from 'medusa-core-utils';
import { FindConfig, Selector,QuerySelector } from "@medusajs/medusa/dist/types/common";
import {buildQuery, setMetadata} from "@medusajs/medusa/dist/utils";
import { CreateUserInput, UpdateUserInput} from '../types/user';
import  { validateEmail } from '@medusajs/medusa/dist/utils/is-email'
import StoreService from '../../store/services/store.service';
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import  AnalyticsConfigService  from "@medusajs/medusa/dist/services/analytics-config";

type ConstructorParams = {
    manager: EntityManager;
    userRepository: typeof UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
    storeService: any;
    featureFlagRouter: FlagRouter;
    analyticsConfigService: AnalyticsConfigService;
};

@Service({ scope: 'SCOPED', override: MedusaUserService })
export  class UserService extends MedusaUserService {
    static resolutionKey = 'userService';
    private readonly manager: EntityManager;
    private readonly userRepository: typeof UserRepository;
    private readonly eventBus: EventBusService;
    private readonly storeService: any;
    
    constructor(private readonly container: ConstructorParams) {
        super(container);
        this.manager = container.manager;
        this.userRepository = container.userRepository;
        this.eventBus = container.eventBusService;
        this.storeService = container.storeService;
    }

    /**
   * Deletes a user from a given user id.
   * @param {string} userId - the id of the user to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(userId: string): Promise<void> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository)

      // Should not fail, if user does not exist, since delete is idempotent
      const user = await userRepo.findOne({ where: { id: userId } })

      if (!user) {
        return Promise.resolve()
      }

      await userRepo.softRemove(user)

      await this.eventBus_.emit(UserService.Events.DELETED, { id: user.id })

      return Promise.resolve()
    })
  }

  /**
   * Updates a user.
   * @param {object} userId - id of the user to update
   * @param {object} update - the values to be updated on the user
   * @return {Promise} the result of create
   */
  async update(userId: string, update: UpdateUserInput): Promise<User> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository_)

      const user = await this.retrieve(userId)

      const { email, phone, user_name, metadata, ...rest } = update


      //check email  already exist
      let existing = await this.retrieveByEmail(email).catch(() => undefined)
  
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given email already has an account."
          )
        }
      //check phone already exist
      if(phone) {
        existing = await this.retrieveByPhone(phone).catch(() => undefined);
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given phone already has an account."
          )
        }
      }
      //check user name already exist
      if(user_name) {
        existing = await this.retrieveByUsername(user_name).catch(() => undefined);
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given username already has an account."
          )
        }
      }
    
      if (metadata) {
        user.metadata = setMetadata(user, metadata)
      }

      for (const key of Object.keys(update)) {
        if (typeof update[key] !== `undefined`) {
            user[key] = update[key]
        }
      }


      const updatedUser = await userRepo.save(user)

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.UPDATED, { id: updatedUser.id })

      return updatedUser
    })
  }

   
     /**
   * Creates a user with username being validated.
   * Fails if email is not a valid format.
   * @param {object} user - the user to create
   * @param {string} password - user's password to hash
   * @return {Promise} the result of create
   */
  async create(user: CreateUserInput, loggedInUserId: string): Promise<User> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.getCustomRepository(this.userRepository)

      
      // let store_id = Object.keys(this.container).includes("loggedInUser")
      //   ? this.container.loggedInUser.store_id
      //   : null;

     
      const validatedEmail = validateEmail(user.email);

      user.email = validatedEmail.toLowerCase();
      
      const { email, password } = user;
  
      //check email  already exist
      let existing = await this.retrieveByEmail(email).catch(() => undefined)
  
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given email already has an account. Log in instead"
          )
        }
      //check phone already exist
      if(user.phone) {
        existing = await this.retrieveByPhone(user.phone).catch(() => undefined);
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given phone already has an account. Log in instead"
          )
        }
      }
      //check user name already exist
      if(user.user_name) {
        existing = await this.retrieveByUsername(user.user_name).catch(() => undefined);
        if (existing) {
          throw new MedusaError(
            MedusaError.Types.DUPLICATE_ERROR,
            "A user with the given username already has an account. Log in instead"
          )
        }
      }
    
    //check store  exist
    // if(user.store_id) {
    //   console.log("store,", this.storeService);
      
    //   existing = await this.storeService.retrieveById(user.store_id).catch(() => undefined);
    //   if (!existing) {
    //     throw new MedusaError(
    //       MedusaError.Types.NOT_FOUND,
    //       "The store does not exist"
    //     )
    //   }
    // }
      if (password) {
        const hashedPassword = await this.hashPassword_(password)
        user.password_hash = hashedPassword
        delete user.password
      }

      //loggedInUser
      const loggedInUser = await this.retrieve(loggedInUserId).catch(() => undefined)
      if(loggedInUser && loggedInUser.store_id){
        user.store_id = loggedInUser.store_id;
      }

      const created = userRepo.create(user);
      
      const newUser = await userRepo.save(created)

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.CREATED, { id: newUser.id })

       return newUser;

      
    })
  }
    


    public async addUserToStore (user_id, store_id) {
        await this.atomicPhase_(async (m) => {
              const userRepo = m.getCustomRepository(this.userRepository);
              //const query = this.buildQuery_({ id: user_id });
              const query = buildQuery({ id: user_id });
        
              const user = await userRepo.findOne(query);
              if (user) {
                  user.store_id = store_id;
                  await userRepo.save(user);
              }
          })
        }

    // public async retrieve(userId: string, config?: FindConfig<User>): Promise<User> {
    //     const userRepo = this.manager.getCustomRepository(this.userRepository);
    //    // const validatedId = this.validateId_(userId);
    //     const query = this.buildQuery_({ id: userId }, config);
        
    //     const user = await userRepo.findOne(query);

    //     if (!user) {
    //         throw new MedusaError(MedusaError.Types.NOT_FOUND, `User with id: ${userId} was not found`);
    //     }

    //     return user as User;
    // }
    // buildQuery_(selector, config = {}): object {
    //     if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
    //         selector['store_id'] = this.container.loggedInUser.store_id;
    //     }
    
    //     return buildQuery(selector, config);
    // }
   
   
     
  /**
   * Retrieve a user by id
   *
   * @param user_id - id of the user to retrieve
   * @param config - user config
   *@returns a user
   */
   async retrieve(
    user_id: string,
    config: FindConfig<User> = {}
  ): Promise<User | never> {
    return await this.retrieve_({ id: user_id }, config)
  }

  /**
   * Lists user based on the provided parameters and includes the count of
   * user that match the query.
   * @return an array containing the user as
   *   the first element and the total count of user that matches the query
   *   as the second element.
   */
   async listAndCount(
    user_id: string,
    selector: QuerySelector<User>,
    config: FindConfig<User> = {
      skip: 0,
      take: 20,
    }
  ): Promise<[User[], number]> {
    const manager = this.manager_
    const userRepo = manager.getCustomRepository(this.userRepository)

    const loggedInUser = await this.retrieve(user_id);
    // retrieve th users associated with the login user's store
    if(loggedInUser.store_id){
      selector.store_id = loggedInUser.store_id;
    }

    const selector_ = { ...selector }
    let q: string | undefined
    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery(selector_, config)

    if (q) {
      return await userRepo.getFreeTextSearchResultsAndCount(q, query)
    }

    return await userRepo.findAndCount(query)
  }

  
  /**
   * A generic retrieve used to find a user by different attributes.
   *
   * @param selector - user selector
   * @param config - find config
   * @returns a single user matching the query or throws
   */
   protected async retrieve_(
    selector: Selector<User>,
    config: FindConfig<User> = {}
  ): Promise<User> {
    const manager = this.manager_

    const userRepo = manager.getCustomRepository(this.userRepository);

    const { relations, ...query } = buildQuery(selector, config)

    const user = await userRepo.findOneWithRelations(
      relations as (keyof User)[],
      query
    )

    if (!user) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with ${selectorConstraints} was not found`
      )
    }

    return user
  }
  

    
     /**
   * Gets a user by email.
   * @param {string} email - the email of the user to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<User>} the user document.
   */
  async retrieveByEmail(
    email: string,
    config: FindConfig<User> = {}
  ): Promise<User | never> {
    return await this.retrieve_({ email: email.toLowerCase() }, config)
  }

   /**
   * Gets a user by phone.
   * @param {string} phone - the phone of the user to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<User>} the user document.
   */
    async retrieveByPhone(
      phone: string,
      config: FindConfig<User> = {}
    ): Promise<User | never> {
      return await this.retrieve_({ phone: phone }, config)
    }
     /**
   * Gets a user by username.
   * @param {string} username - the username of the user to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<User>} the user document.
   */
      async retrieveByUsername(
        user_name: string,
        config: FindConfig<User> = {}
      ): Promise<User | never> {
        return await this.retrieve_({ user_name: user_name }, config)
      }
  

}