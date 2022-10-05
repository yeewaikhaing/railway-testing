import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { UserService as MedusaUserService } from '@medusajs/medusa/dist/services';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
import { MedusaError } from 'medusa-core-utils';
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import {buildQuery} from "@medusajs/medusa/dist/utils";

type ConstructorParams = {
    manager: EntityManager;
    userRepository: typeof UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
};

@Service({ scope: 'SCOPED', override: MedusaUserService })
export default class UserService extends MedusaUserService {
    static resolutionKey = 'userService';
    private readonly manager: EntityManager;
    private readonly userRepository: typeof UserRepository;
    private readonly eventBus: EventBusService;

    constructor(private readonly container: ConstructorParams) {
        super(container);
        this.manager = container.manager;
        this.userRepository = container.userRepository;
        this.eventBus = container.eventBusService;
    }
    public async addUserToStore (user_id, store_id) {
        await this.atomicPhase_(async (m) => {
              const userRepo = m.getCustomRepository(this.userRepository);
              const query = this.buildQuery_({ id: user_id });
        
              const user = await userRepo.findOne(query);
              if (user) {
                  user.store_id = store_id;
                  await userRepo.save(user);
              }
          })
        }

    public async retrieve(userId: string, config?: FindConfig<User>): Promise<User> {
        const userRepo = this.manager.getCustomRepository(this.userRepository);
        const validatedId = this.validateId_(userId);
        const query = this.buildQuery_({ id: validatedId }, config);
        
        const user = await userRepo.findOne(query);

        if (!user) {
            throw new MedusaError(MedusaError.Types.NOT_FOUND, `User with id: ${userId} was not found`);
        }

        return user as User;
    }
    buildQuery_(selector, config = {}): object {
        if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
            selector['store_id'] = this.container.loggedInUser.store_id;
        }
    
        return super.buildQuery_(selector, config);
    }
    withTransaction(transactionManager: EntityManager): UserService {
        if (!transactionManager) {
            return this
        }
    
        const cloned = new UserService({
            ...this.container,
            manager: transactionManager
        })
    
        cloned.transactionManager = transactionManager
    
        return cloned
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
    return await this.customRetrieve({ email: email.toLowerCase() }, config)
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
      return await this.customRetrieve({ phone: phone }, config)
    }
     /**
   * Gets a user by username.
   * @param {string} username - the username of the user to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<User>} the user document.
   */
      async retrieveByUsername(
        username: string,
        config: FindConfig<User> = {}
      ): Promise<User | never> {
        return await this.customRetrieve({ user_name: username }, config)
      }
  private async customRetrieve(
    selector: Selector<User>,
    config: FindConfig<User> = {}
  ): Promise<User | never> {
    
    const userRepo = this.manager.getCustomRepository(this.userRepository)

    const query = buildQuery(selector, config)
    const user = await userRepo.findOne(query)

    if (!user) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with ${selectorConstraints} was not found`
      )
    }

    return user;
  }

}