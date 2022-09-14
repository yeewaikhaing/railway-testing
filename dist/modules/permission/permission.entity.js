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
exports.Permission = void 0;
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const db_aware_column_1 = require("@medusajs/medusa/dist/utils/db-aware-column");
const medusa_extender_1 = require("medusa-extender");
const role_entity_1 = require("../role/role.entity");
const utils_1 = require("@medusajs/medusa/dist/utils");
let Permission = class Permission extends medusa_1.BaseEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, "perm");
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "varchar" }),
    __metadata("design:type", String)
], Permission.prototype, "name", void 0);
__decorate([
    (0, db_aware_column_1.DbAwareColumn)({ type: "jsonb", nullable: true }),
    __metadata("design:type", Object)
], Permission.prototype, "metadata", void 0);
__decorate([
    (0, typeorm_1.ManyToMany)(() => role_entity_1.Role),
    (0, typeorm_1.JoinTable)({
        name: "role_permissions",
        joinColumn: {
            name: "permission_id",
            referencedColumnName: "id",
        },
        inverseJoinColumn: {
            name: "role_id",
            referencedColumnName: "id",
        },
    }),
    __metadata("design:type", Array)
], Permission.prototype, "roles", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], Permission.prototype, "beforeInsert", null);
Permission = __decorate([
    (0, medusa_extender_1.Entity)(),
    (0, typeorm_1.Entity)()
], Permission);
exports.Permission = Permission;
//# sourceMappingURL=permission.entity.js.map