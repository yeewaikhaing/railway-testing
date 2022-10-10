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
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_extender_1 = require("medusa-extender");
const utils_1 = require("@medusajs/medusa/dist/utils");
const medusa_core_utils_1 = require("medusa-core-utils");
let StoreService = class StoreService extends services_1.StoreService {
    constructor(container) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.storeRepository = container.storeRepository;
    }
    /**
    * Retrieve the store settings. There is always a maximum of one store.
    * @param config The config object from which the query will be built
    * @return the store
    */
    async retrieveById(store_id, config = {}) {
        const storeRepo = this.manager.getCustomRepository(this.storeRepository);
        const query = (0, utils_1.buildQuery)({ id: store_id }, config);
        const store = await storeRepo.findOne(query);
        if (!store) {
            throw new medusa_core_utils_1.MedusaError(medusa_core_utils_1.MedusaError.Types.NOT_FOUND, "Store does not exist");
        }
        return store;
    }
    //@OnMedusaEntityEvent.Before.Insert(User, { async: true })
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
    //@OnMedusaEntityEvent.Before.Insert(Invite, { async: true })
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
    async customRetrieve(relations = [], config = {}) {
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
};
StoreService = __decorate([
    (0, medusa_extender_1.Service)({ override: services_1.StoreService, scope: 'SCOPED' }),
    __metadata("design:paramtypes", [Object])
], StoreService);
exports.default = StoreService;
//# sourceMappingURL=store.service.js.map