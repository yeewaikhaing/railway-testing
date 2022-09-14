"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("@medusajs/medusa/dist/repositories/user");
const medusa_extender_1 = require("medusa-extender");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../entities/user.entity");
let UserRepository = class UserRepository extends medusa_extender_1.Utils.repositoryMixin(user_1.UserRepository) {
};
UserRepository = __decorate([
    (0, medusa_extender_1.Repository)({ override: user_1.UserRepository }),
    (0, typeorm_1.EntityRepository)(user_entity_1.User)
], UserRepository);
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map