"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RoleMigration1662296948124 = void 0;
const medusa_extender_1 = require("medusa-extender");
const typeorm_1 = require("typeorm");
let RoleMigration1662296948124 = class RoleMigration1662296948124 {
    constructor() {
        this.name = 'RoleMigration1662296948124';
    }
    async up(queryRunner) {
        const query = `
        CREATE TABLE "role" ("id" character varying NOT NULL, 
        "name" character varying NOT NULL, "store_id" character varying NOT NULL,
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now())
        `;
        await queryRunner.query(query);
        await queryRunner.createPrimaryKey("role", ["id"]);
        await queryRunner.createForeignKey("role", new typeorm_1.TableForeignKey({
            columnNames: ["store_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "store",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }
    async down(queryRunner) {
        await queryRunner.dropTable("role", true);
    }
};
RoleMigration1662296948124 = __decorate([
    (0, medusa_extender_1.Migration)()
], RoleMigration1662296948124);
exports.RoleMigration1662296948124 = RoleMigration1662296948124;
//# sourceMappingURL=1662296948124-role.migration.js.map