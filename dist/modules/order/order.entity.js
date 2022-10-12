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
var Order_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const typeorm_1 = require("typeorm");
const medusa_extender_1 = require("medusa-extender");
const medusa_1 = require("@medusajs/medusa");
const store_entity_1 = require("../store/entities/store.entity");
let Order = Order_1 = class Order extends medusa_1.Order {
};
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Order.prototype, "store_id", void 0);
__decorate([
    (0, typeorm_1.Index)(),
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Order.prototype, "order_parent_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.orders),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], Order.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Order_1, (order) => order.children),
    (0, typeorm_1.JoinColumn)({ name: 'order_parent_id' }),
    __metadata("design:type", Order)
], Order.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Order_1, (order) => order.parent),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'order_parent_id' }),
    __metadata("design:type", Array)
], Order.prototype, "children", void 0);
Order = Order_1 = __decorate([
    (0, medusa_extender_1.Entity)({ override: medusa_1.Order }),
    (0, typeorm_1.Entity)()
], Order);
exports.Order = Order;
//# sourceMappingURL=order.entity.js.map