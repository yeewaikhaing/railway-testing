"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderMigration1661689658400 = void 0;
const medusa_extender_1 = require("medusa-extender");
let OrderMigration1661689658400 = class OrderMigration1661689658400 {
    constructor() {
        this.name = 'OrderMigration1661689658400';
    }
    async up(queryRunner) {
        const query = `
            ALTER TABLE public."order" ADD COLUMN IF NOT EXISTS "store_id" text; 
            ALTER TABLE public."order" ADD COLUMN IF NOT EXISTS "order_parent_id" text;
            ALTER TABLE public."order" ADD CONSTRAINT "FK_8a96dde86e3cad9d2fcc6cb171f87" FOREIGN KEY ("order_parent_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
        `;
        await queryRunner.query(query);
    }
    async down(queryRunner) {
        const query = `
            ALTER TABLE public."order" DROP COLUMN "store_id";
            ALTER TABLE public."order" DROP COLUMN "order_parent_id";
            ALTER TABLE public."order" DROP FOREIGN KEY "FK_8a96dde86e3cad9d2fcc6cb171f87cb2"; 
        `;
        await queryRunner.query(query);
    }
};
OrderMigration1661689658400 = __decorate([
    (0, medusa_extender_1.Migration)()
], OrderMigration1661689658400);
exports.OrderMigration1661689658400 = OrderMigration1661689658400;
//# sourceMappingURL=1661689658400-order.migration.js.map