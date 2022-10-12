"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PermissionMigration1662297363988 = void 0;
const medusa_extender_1 = require("medusa-extender");
const typeorm_1 = require("typeorm");
let PermissionMigration1662297363988 = class PermissionMigration1662297363988 {
    constructor() {
        this.name = 'PermissionMigration1662297363988';
    }
    async up(queryRunner) {
        let query = `
        CREATE TABLE "permission" ("id" character varying NOT NULL, 
        "name" character varying NOT NULL, "metadata" jsonb,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`;
        await queryRunner.query(query);
        await queryRunner.createPrimaryKey("permission", ["id"]);
        query = `
        CREATE TABLE "role_permissions" ("role_id" character varying NOT NULL, "permission_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())`;
        await queryRunner.query(query);
        await queryRunner.createPrimaryKey("role_permissions", ["role_id", "permission_id"]);
        await queryRunner.createForeignKey("role_permissions", new typeorm_1.TableForeignKey({
            columnNames: ["role_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "role",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
        await queryRunner.createForeignKey("role_permissions", new typeorm_1.TableForeignKey({
            columnNames: ["permission_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "permission",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("role_permissions", true);
        await queryRunner.dropTable("permission", true);
    }
};
PermissionMigration1662297363988 = __decorate([
    (0, medusa_extender_1.Migration)()
], PermissionMigration1662297363988);
exports.PermissionMigration1662297363988 = PermissionMigration1662297363988;
//# sourceMappingURL=1662297363988-permission.migration.js.map