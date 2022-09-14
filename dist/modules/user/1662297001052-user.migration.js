"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserMigration1662297001052 = void 0;
const medusa_extender_1 = require("medusa-extender");
const typeorm_1 = require("typeorm");
let UserMigration1662297001052 = class UserMigration1662297001052 {
    constructor() {
        this.name = 'UserMigration1662297001052';
    }
    async up(queryRunner) {
        const query = `ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "role_id" text;`;
        await queryRunner.query(query);
        await queryRunner.createForeignKey("user", new typeorm_1.TableForeignKey({
            columnNames: ["role_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "role",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    }
    async down(queryRunner) {
        const query = `ALTER TABLE public."user" DROP COLUMN "role_id";`;
        await queryRunner.query(query);
    }
};
UserMigration1662297001052 = __decorate([
    (0, medusa_extender_1.Migration)()
], UserMigration1662297001052);
exports.UserMigration1662297001052 = UserMigration1662297001052;
//# sourceMappingURL=1662297001052-user.migration.js.map