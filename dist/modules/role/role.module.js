"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleModule = void 0;
const medusa_extender_1 = require("medusa-extender");
const role_entity_1 = require("./role.entity");
const _1662296948124_role_migration_1 = require("./1662296948124-role.migration");
const role_repository_1 = require("./role.repository");
let RoleModule = class RoleModule {
};
RoleModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [
            role_entity_1.Role,
            role_repository_1.RoleRepository,
            _1662296948124_role_migration_1.RoleMigration1662296948124
        ]
    })
], RoleModule);
exports.RoleModule = RoleModule;
//# sourceMappingURL=role.module.js.map