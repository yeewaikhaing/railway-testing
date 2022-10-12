"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const store_1 = require("@medusajs/medusa/dist/repositories/store");
const medusa_extender_1 = require("medusa-extender");
const store_entity_1 = require("../entities/store.entity");
let StoreRepository = class StoreRepository extends medusa_extender_1.Utils.repositoryMixin(store_1.StoreRepository) {
};
StoreRepository = __decorate([
    (0, medusa_extender_1.Repository)({ override: store_1.StoreRepository }),
    (0, typeorm_1.EntityRepository)(store_entity_1.Store)
], StoreRepository);
exports.default = StoreRepository;
//# sourceMappingURL=store.repository.js.map