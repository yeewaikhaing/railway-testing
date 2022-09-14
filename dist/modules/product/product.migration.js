"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_extender_1 = require("medusa-extender");
let addStoreIdToProduct1645034402086 = class addStoreIdToProduct1645034402086 {
    constructor() {
        this.name = 'addStoreIdToProduct1645034402086';
    }
    async up(queryRunner) {
        const query = `ALTER TABLE public."product" ADD COLUMN IF NOT EXISTS "store_id" text;`;
        await queryRunner.query(query);
    }
    async down(queryRunner) {
        const query = `ALTER TABLE public."product" DROP COLUMN "store_id";`;
        await queryRunner.query(query);
    }
};
addStoreIdToProduct1645034402086 = __decorate([
    (0, medusa_extender_1.Migration)()
], addStoreIdToProduct1645034402086);
exports.default = addStoreIdToProduct1645034402086;
//# sourceMappingURL=product.migration.js.map