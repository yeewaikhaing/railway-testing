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
var StoreService_1;
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_extender_1 = require("medusa-extender");
const user_entity_1 = require("../../user/entities/user.entity");
const invite_entity_1 = require("../../invite/invite.entity");
let StoreService = StoreService_1 = class StoreService extends services_1.StoreService {
    constructor(container) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.storeRepository = container.storeRepository;
    }
    withTransaction(transactionManager) {
        if (!transactionManager) {
            return this;
        }
        const cloned = new StoreService_1(Object.assign(Object.assign({}, this.container), { manager: transactionManager }));
        cloned.transactionManager_ = transactionManager;
        return cloned;
    }
    async createStoreForNewUser(params) {
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
    async addStoreToInvite(params) {
        const { event } = params; //invite to be created is in event.entity
        let store_id = this.container.loggedInUser.store_id;
        if (!event.entity.store_id && store_id) {
            event.entity.store_id = store_id;
        }
        return event;
    }
    async createForUser(user) {
        if (user.store_id) {
            return;
        }
        const storeRepo = this.manager.getCustomRepository(this.storeRepository);
        const store = storeRepo.create();
        return storeRepo.save(store);
    }
    async retrieve(relations = []) {
        if (!Object.keys(this.container).includes('loggedInUser')) {
            return super.retrieve(relations);
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
};
__decorate([
    medusa_extender_1.OnMedusaEntityEvent.Before.Insert(user_entity_1.User, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreService.prototype, "createStoreForNewUser", null);
__decorate([
    medusa_extender_1.OnMedusaEntityEvent.Before.Insert(invite_entity_1.Invite, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], StoreService.prototype, "addStoreToInvite", null);
StoreService = StoreService_1 = __decorate([
    (0, medusa_extender_1.Service)({ override: services_1.StoreService, scope: 'SCOPED' }),
    __metadata("design:paramtypes", [Object])
], StoreService);
exports.default = StoreService;
//# sourceMappingURL=store.service.js.map