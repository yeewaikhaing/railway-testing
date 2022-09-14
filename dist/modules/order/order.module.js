"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderModule = void 0;
const medusa_extender_1 = require("medusa-extender");
const order_entity_1 = require("./order.entity");
const _1661689658400_order_migration_1 = require("./1661689658400-order.migration");
const order_repository_1 = require("./order.repository");
const order_service_1 = require("./order.service");
//import { OrderSubscriber } from './order.subscriber';
let OrderModule = class OrderModule {
};
OrderModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [order_entity_1.Order, order_repository_1.OrderRepository, order_service_1.OrderService, _1661689658400_order_migration_1.OrderMigration1661689658400]
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map