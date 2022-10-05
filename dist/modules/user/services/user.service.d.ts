import { EntityManager } from 'typeorm';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { UserService as MedusaUserService } from '@medusajs/medusa/dist/services';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
import { FindConfig } from "@medusajs/medusa/dist/types/common";
declare type ConstructorParams = {
    manager: EntityManager;
    userRepository: typeof UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
};
export default class UserService extends MedusaUserService {
    private readonly container;
    static resolutionKey: string;
    private readonly manager;
    private readonly userRepository;
    private readonly eventBus;
    constructor(container: ConstructorParams);
    addUserToStore(user_id: any, store_id: any): Promise<void>;
    retrieve(userId: string, config?: FindConfig<User>): Promise<User>;
    buildQuery_(selector: any, config?: {}): object;
    withTransaction(transactionManager: EntityManager): UserService;
    /**
  * Gets a user by email.
  * @param {string} email - the email of the user to get.
  * @param {Object} config - the config object containing query settings
  * @return {Promise<User>} the user document.
  */
    retrieveByEmail(email: string, config?: FindConfig<User>): Promise<User | never>;
    /**
    * Gets a user by phone.
    * @param {string} phone - the phone of the user to get.
    * @param {Object} config - the config object containing query settings
    * @return {Promise<User>} the user document.
    */
    retrieveByPhone(phone: string, config?: FindConfig<User>): Promise<User | never>;
    /**
  * Gets a user by username.
  * @param {string} username - the username of the user to get.
  * @param {Object} config - the config object containing query settings
  * @return {Promise<User>} the user document.
  */
    retrieveByUsername(username: string, config?: FindConfig<User>): Promise<User | never>;
    private customRetrieve;
}
export {};
