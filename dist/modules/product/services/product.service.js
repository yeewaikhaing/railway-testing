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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var _ProductService_manager;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const medusa_extender_1 = require("medusa-extender");
const services_1 = require("@medusajs/medusa/dist/services");
const product_entity_1 = require("../entities/product.entity");
let ProductService = class ProductService extends services_1.ProductService {
    constructor(container) {
        super(container);
        _ProductService_manager.set(this, void 0);
        __classPrivateFieldSet(this, _ProductService_manager, container.manager, "f");
        this.container = container;
    }
    async attachStoreToProduct(params) {
        const { event } = params;
        const loggedInUser = this.container.loggedInUser;
        event.entity.store_id = loggedInUser.store_id;
        return event;
    }
    myPrepareListQuery_(selector, config) {
        const loggedInUser = Object.keys(this.container).includes('loggedInUser') ? this.container.loggedInUser : null;
        if (loggedInUser) {
            selector['store_id'] = loggedInUser.store_id;
        }
        return super.prepareListQuery_(selector, config);
    }
};
_ProductService_manager = new WeakMap();
__decorate([
    medusa_extender_1.OnMedusaEntityEvent.Before.Insert(product_entity_1.Product, { async: true }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductService.prototype, "attachStoreToProduct", null);
ProductService = __decorate([
    (0, medusa_extender_1.Service)({ scope: 'SCOPED', override: services_1.ProductService }),
    __metadata("design:paramtypes", [Object])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map