"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionModule = void 0;
const medusa_extender_1 = require("medusa-extender");
const permission_entity_1 = require("./permission.entity");
const _1662297363988_permission_migration_1 = require("./1662297363988-permission.migration");
const permission_repository_1 = require("./permission.repository");
let PermissionModule = class PermissionModule {
};
PermissionModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [
            permission_entity_1.Permission,
            permission_repository_1.PermissionRepository,
            _1662297363988_permission_migration_1.PermissionMigration1662297363988
        ]
    })
], PermissionModule);
exports.PermissionModule = PermissionModule;
//# sourceMappingURL=permission.module.js.map