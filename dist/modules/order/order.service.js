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
exports.OrderService = void 0;
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_extender_1 = require("medusa-extender");
let OrderService = class OrderService extends services_1.OrderService {
    constructor(container) {
        super(container);
        this.manager = container.manager;
        this.container = container;
    }
    buildQuery_(selector, config) {
        var _a;
        // if (this.container.loggedInUser && this.container.loggedInUser.store_id) {
        //     selector['store_id'] = this.container.loggedInUser.store_id;
        // }
        if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
            selector['store_id'] = this.container.loggedInUser.store_id;
        }
        config.select.push('store_id');
        config.relations = (_a = config.relations) !== null && _a !== void 0 ? _a : [];
        config.relations.push("children", "parent", "store");
        return super.buildQuery_(selector, config);
    }
};
OrderService = __decorate([
    (0, medusa_extender_1.Service)({ scope: 'SCOPED', override: services_1.OrderService }),
    __metadata("design:paramtypes", [Object])
], OrderService);
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map