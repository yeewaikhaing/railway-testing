"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const medusa_extender_1 = require("medusa-extender");
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_core_utils_1 = require("medusa-core-utils");
const utils_1 = require("@medusajs/medusa/dist/utils");
const is_email_1 = require("@medusajs/medusa/dist/utils/is-email");
let UserService = UserService_1 = class UserService extends services_1.UserService {
    constructor(container) {
        super(container);
        this.container = container;
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
    async delete(userId) {
        return await this.atomicPhase_(async (manager) => {
            const userRepo = manager.getCustomRepository(this.userRepository);
            // Should not fail, if user does not exist, since delete is idempotent
            const user = await userRepo.findOne({ where: { id: userId } });
            if (!user) {
                return Promise.resolve();
            }
            await userRepo.softRemove(user);
            await this.eventBus_.emit(UserService_1.Events.DELETED, { id: user.id });
            return Promise.resolve();
        });
    }
    /**
   * Updates a user.
   * @param {object} userId - id of the user to update
   * @param {object} update - the values to be updated on the user
   * @return {Promise} the result of create
   */
    async update(userId, update) {
        return await this.atomicPhase_(async (manager) => {
            const userRepo = manager.getCustomRepository(this.userRepository_);
            const user = await this.retrieve(userId);
            const { email, phone, user_name, metadata } = update, rest = __rest(update
            //check email  already exist
            , ["email", "phone", "user_name", "metadata"]);
            //check email  already exist
            let existing = await this.retrieveByEmail(email).catch(() => undefined);
            if (existing) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given email already has an account.");
            }
            //check phone already exist
            if (phone) {
                existing = await this.retrieveByPhone(phone).catch(() => undefined);
                if (existing) {
                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given phone already has an account.");
                }
            }
            //check user name already exist
            if (user_name) {
                existing = await this.retrieveByUsername(user_name).catch(() => undefined);
                if (existing) {
                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given username already has an account.");
                }
            }
            if (metadata) {
                user.metadata = (0, utils_1.setMetadata)(user, metadata);
            }
            for (const key of Object.keys(update)) {
                if (typeof update[key] !== `undefined`) {
                    user[key] = update[key];
                }
            }
            const updatedUser = await userRepo.save(user);
            await this.eventBus_
                .withTransaction(manager)
                .emit(UserService_1.Events.UPDATED, { id: updatedUser.id });
            return updatedUser;
        });
    }
    /**
  * Creates a user with username being validated.
  * Fails if email is not a valid format.
  * @param {object} user - the user to create
  * @param {string} password - user's password to hash
  * @return {Promise} the result of create
  */
    async create(user, loggedInUserId) {
        return await this.atomicPhase_(async (manager) => {
            const userRepo = manager.getCustomRepository(this.userRepository);
            // let store_id = Object.keys(this.container).includes("loggedInUser")
            //   ? this.container.loggedInUser.store_id
            //   : null;
            const validatedEmail = (0, is_email_1.validateEmail)(user.email);
            user.email = validatedEmail.toLowerCase();
            const { email, password } = user;
            //check email  already exist
            let existing = await this.retrieveByEmail(email).catch(() => undefined);
            if (existing) {
                throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given email already has an account. Log in instead");
            }
            //check phone already exist
            if (user.phone) {
                existing = await this.retrieveByPhone(user.phone).catch(() => undefined);
                if (existing) {
                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given phone already has an account. Log in instead");
                }
            }
            //check user name already exist
            if (user.user_name) {
                existing = await this.retrieveByUsername(user.user_name).catch(() => undefined);
                if (existing) {
                    throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.DUPLICATE_ERROR, "A user with the given username already has an account. Log in instead");
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
                const hashedPassword = await this.hashPassword_(password);
                user.password_hash = hashedPassword;
                delete user.password;
            }
            //loggedInUser
            const loggedInUser = await this.retrieve(loggedInUserId).catch(() => undefined);
            if (loggedInUser && loggedInUser.store_id) {
                user.store_id = loggedInUser.store_id;
            }
            const created = userRepo.create(user);
            // const newUser = await userRepo.save(created)
            // await this.eventBus_
            //   .withTransaction(manager)
            //   .emit(UserService.Events.CREATED, { id: newUser.id })
            //  return newUser;
            return created;
        });
    }
    async addUserToStore(user_id, store_id) {
        await this.atomicPhase_(async (m) => {
            const userRepo = m.getCustomRepository(this.userRepository);
            //const query = this.buildQuery_({ id: user_id });
            const query = (0, utils_1.buildQuery)({ id: user_id });
            const user = await userRepo.findOne(query);
            if (user) {
                user.store_id = store_id;
                await userRepo.save(user);
            }
        });
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
    async retrieve(user_id, config = {}) {
        return await this.retrieve_({ id: user_id }, config);
    }
    /**
     * Lists user based on the provided parameters and includes the count of
     * user that match the query.
     * @return an array containing the user as
     *   the first element and the total count of user that matches the query
     *   as the second element.
     */
    async listAndCount(user_id, selector, config = {
        skip: 0,
        take: 20,
    }) {
        const manager = this.manager_;
        const userRepo = manager.getCustomRepository(this.userRepository);
        const loggedInUser = await this.retrieve(user_id);
        // retrieve th users associated with the login user's store
        if (loggedInUser.store_id) {
            selector.store_id = loggedInUser.store_id;
        }
        const selector_ = Object.assign({}, selector);
        let q;
        if ("q" in selector_) {
            q = selector_.q;
            delete selector_.q;
        }
        const query = (0, utils_1.buildQuery)(selector_, config);
        if (q) {
            return await userRepo.getFreeTextSearchResultsAndCount(q, query);
        }
        return await userRepo.findAndCount(query);
    }
    /**
     * A generic retrieve used to find a user by different attributes.
     *
     * @param selector - user selector
     * @param config - find config
     * @returns a single user matching the query or throws
     */
    async retrieve_(selector, config = {}) {
        const manager = this.manager_;
        const userRepo = manager.getCustomRepository(this.userRepository);
        const _a = (0, utils_1.buildQuery)(selector, config), { relations } = _a, query = __rest(_a, ["relations"]);
        const user = await userRepo.findOneWithRelations(relations, query);
        if (!user) {
            const selectorConstraints = Object.entries(selector)
                .map((key, value) => `${key}: ${value}`)
                .join(", ");
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `User with ${selectorConstraints} was not found`);
        }
        return user;
    }
    /**
  * Gets a user by email.
  * @param {string} email - the email of the user to get.
  * @param {Object} config - the config object containing query settings
  * @return {Promise<User>} the user document.
  */
    async retrieveByEmail(email, config = {}) {
        return await this.retrieve_({ email: email.toLowerCase() }, config);
    }
    /**
    * Gets a user by phone.
    * @param {string} phone - the phone of the user to get.
    * @param {Object} config - the config object containing query settings
    * @return {Promise<User>} the user document.
    */
    async retrieveByPhone(phone, config = {}) {
        return await this.retrieve_({ phone: phone }, config);
    }
    /**
  * Gets a user by username.
  * @param {string} username - the username of the user to get.
  * @param {Object} config - the config object containing query settings
  * @return {Promise<User>} the user document.
  */
    async retrieveByUsername(user_name, config = {}) {
        return await this.retrieve_({ user_name: user_name }, config);
    }
};
UserService.resolutionKey = 'userService';
UserService = UserService_1 = __decorate([
    (0, medusa_extender_1.Service)({ scope: 'SCOPED', override: services_1.UserService }),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map