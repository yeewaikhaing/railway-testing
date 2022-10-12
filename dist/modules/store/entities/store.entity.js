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
exports.Store = exports.SellerTypes = exports.StoreTypes = void 0;
const dist_1 = require("@medusajs/medusa/dist");
const typeorm_1 = require("typeorm");
const medusa_extender_1 = require("medusa-extender");
const user_entity_1 = require("../../user/entities/user.entity");
const product_entity_1 = require("../../product/entities/product.entity");
const order_entity_1 = require("../../order/order.entity");
const invite_entity_1 = require("./../../invite/invite.entity");
const role_entity_1 = require("../../role/role.entity");
var StoreTypes;
(function (StoreTypes) {
    StoreTypes["ONLINE"] = "online";
    StoreTypes["OFFICIAL_STORE"] = "offical store";
    StoreTypes["AUTHORIZED"] = "authorized";
})(StoreTypes = exports.StoreTypes || (exports.StoreTypes = {}));
var SellerTypes;
(function (SellerTypes) {
    SellerTypes["WHOLESALE"] = "wholesale";
    SellerTypes["RETAIL"] = "retail";
})(SellerTypes = exports.SellerTypes || (exports.SellerTypes = {}));
let Store = class Store extends dist_1.Store {
};
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Store.prototype, "store_logo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "character varying", nullable: false, default: StoreTypes.ONLINE }),
    __metadata("design:type", String)
], Store.prototype, "store_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "character varying", nullable: false }),
    __metadata("design:type", String)
], Store.prototype, "seller_type", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Store.prototype, "state_division", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Store.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false }),
    __metadata("design:type", String)
], Store.prototype, "township", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: false, type: 'text' }),
    __metadata("design:type", String)
], Store.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => user_entity_1.User, (user) => user.store),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'store_id' }),
    __metadata("design:type", Array)
], Store.prototype, "members", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, (product) => product.store),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'store_id' }),
    __metadata("design:type", Array)
], Store.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.store),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'store_id' }),
    __metadata("design:type", Array)
], Store.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => invite_entity_1.Invite, (invite) => invite.store),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'store_id' }),
    __metadata("design:type", Array)
], Store.prototype, "invites", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => role_entity_1.Role, (role) => role.store),
    (0, typeorm_1.JoinColumn)({ name: 'id', referencedColumnName: 'store_id' }),
    __metadata("design:type", Array)
], Store.prototype, "roles", void 0);
Store = __decorate([
    (0, medusa_extender_1.Entity)({ override: dist_1.Store }),
    (0, typeorm_1.Entity)()
], Store);
exports.Store = Store;
//# sourceMappingURL=store.entity.js.map