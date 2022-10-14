import { EntityManager } from 'typeorm';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { UserService as MedusaUserService } from '@medusajs/medusa/dist/services';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
import { FindConfig, Selector, QuerySelector } from "@medusajs/medusa/dist/types/common";
import { CreateUserInput, UpdateUserInput } from '../types/user';
declare type ConstructorParams = {
    manager: EntityManager;
    userRepository: typeof UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
    storeService: any;
};
export declare class UserService extends MedusaUserService {
    private readonly container;
    static resolutionKey: string;
    private readonly manager;
    private readonly userRepository;
    private readonly eventBus;
    private readonly storeService;
    constructor(container: ConstructorParams);
    /**
   * Deletes a user from a given user id.
   * @param {string} userId - the id of the user to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
    delete(userId: string): Promise<void>;
    /**
     * Updates a user.
     * @param {object} userId - id of the user to update
     * @param {object} update - the values to be updated on the user
     * @return {Promise} the result of create
     */
    update(userId: string, update: UpdateUserInput): Promise<User>;
    /**
  * Creates a user with username being validated.
  * Fails if email is not a valid format.
  * @param {object} user - the user to create
  * @param {string} password - user's password to hash
  * @return {Promise} the result of create
  */
    create(user: CreateUserInput, loggedInUserId: string): Promise<User>;
    addUserToStore(user_id: any, store_id: any): Promise<void>;
    /**
     * Retrieve a user by id
     *
     * @param user_id - id of the user to retrieve
     * @param config - user config
     *@returns a user
     */
    retrieve(user_id: string, config?: FindConfig<User>): Promise<User | never>;
    /**
     * Lists user based on the provided parameters and includes the count of
     * user that match the query.
     * @return an array containing the user as
     *   the first element and the total count of user that matches the query
     *   as the second element.
     */
    listAndCount(user_id: string, selector: QuerySelector<User>, config?: FindConfig<User>): Promise<[User[], number]>;
    /**
     * A generic retrieve used to find a user by different attributes.
     *
     * @param selector - user selector
     * @param config - find config
     * @returns a single user matching the query or throws
     */
    protected retrieve_(selector: Selector<User>, config?: FindConfig<User>): Promise<User>;
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
    retrieveByUsername(user_name: string, config?: FindConfig<User>): Promise<User | never>;
}
export {};
