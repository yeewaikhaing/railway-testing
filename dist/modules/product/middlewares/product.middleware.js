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
const medusa_extender_1 = require("medusa-extender");
const product_subscriber_1 = __importDefault(require("../subscribers/product.subscriber"));
let AttachProductSubscribersMiddleware = class AttachProductSubscribersMiddleware {
    consume(req, res, next) {
        const { connection } = req.scope.resolve(medusa_extender_1.MEDUSA_RESOLVER_KEYS.manager);
        medusa_extender_1.Utils.attachOrReplaceEntitySubscriber(connection, product_subscriber_1.default);
        return next();
    }
};
AttachProductSubscribersMiddleware = __decorate([
    (0, medusa_extender_1.Middleware)({ requireAuth: true, routes: [{ method: 'post', path: '/admin/products' }] })
], AttachProductSubscribersMiddleware);
exports.default = AttachProductSubscribersMiddleware;
//# sourceMappingURL=product.middleware.js.map