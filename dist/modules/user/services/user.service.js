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
var UserService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_extender_1 = require("medusa-extender");
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_core_utils_1 = require("medusa-core-utils");
let UserService = UserService_1 = class UserService extends services_1.UserService {
    constructor(container) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.userRepository = container.userRepository;
        this.eventBus = container.eventBusService;
    }
    async addUserToStore(user_id, store_id) {
        await this.atomicPhase_(async (m) => {
            const userRepo = m.getCustomRepository(this.userRepository);
            const query = this.buildQuery_({ id: user_id });
            const user = await userRepo.findOne(query);
            if (user) {
                user.store_id = store_id;
                await userRepo.save(user);
            }
        });
    }
    async retrieve(userId, config) {
        const userRepo = this.manager.getCustomRepository(this.userRepository);
        const validatedId = this.validateId_(userId);
        const query = this.buildQuery_({ id: validatedId }, config);
        const user = await userRepo.findOne(query);
        if (!user) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, `User with id: ${userId} was not found`);
        }
        return user;
    }
    buildQuery_(selector, config = {}) {
        if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
            selector['store_id'] = this.container.loggedInUser.store_id;
        }
        return super.buildQuery_(selector, config);
    }
    withTransaction(transactionManager) {
        if (!transactionManager) {
            return this;
        }
        const cloned = new UserService_1(Object.assign(Object.assign({}, this.container), { manager: transactionManager }));
        cloned.transactionManager = transactionManager;
        return cloned;
    }
};
UserService = UserService_1 = __decorate([
    (0, medusa_extender_1.Service)({ scope: 'SCOPED', override: services_1.UserService }),
    __metadata("design:paramtypes", [Object])
], UserService);
exports.default = UserService;
//# sourceMappingURL=user.service.js.map