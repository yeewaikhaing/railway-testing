"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteMigration1662281887790 = void 0;
const medusa_extender_1 = require("medusa-extender");
let InviteMigration1662281887790 = class InviteMigration1662281887790 {
    constructor() {
        this.name = 'InviteMigration1662281887790';
    }
    async up(queryRunner) {
        const query = `
            ALTER TABLE public."invite" ADD COLUMN IF NOT EXISTS "store_id" text; 
        `;
        await queryRunner.query(query);
    }
    async down(queryRunner) {
        const query = `
            ALTER TABLE public."invite" DROP COLUMN "store_id";
        `;
        await queryRunner.query(query);
    }
};
InviteMigration1662281887790 = __decorate([
    (0, medusa_extender_1.Migration)()
], InviteMigration1662281887790);
exports.InviteMigration1662281887790 = InviteMigration1662281887790;
//# sourceMappingURL=1662281887790-invite.migration.js.map