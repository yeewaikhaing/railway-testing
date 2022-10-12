"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModule = void 0;
const medusa_extender_1 = require("medusa-extender");
const product_entity_1 = require("./entities/product.entity");
const product_repository_1 = __importDefault(require("./repositories/product.repository"));
const product_service_1 = require("./services/product.service");
const product_migration_1 = __importDefault(require("./product.migration"));
const product_middleware_1 = __importDefault(require("./middlewares/product.middleware"));
let ProductModule = class ProductModule {
};
ProductModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [
            product_entity_1.Product,
            product_repository_1.default,
            product_service_1.ProductService,
            product_migration_1.default,
            product_middleware_1.default,
        ]
    })
], ProductModule);
exports.ProductModule = ProductModule;
//# sourceMappingURL=product.module.js.map