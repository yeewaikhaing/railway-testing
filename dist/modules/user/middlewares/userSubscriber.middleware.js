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
exports.AttachUserSubscriberMiddleware = void 0;
const medusa_extender_1 = require("medusa-extender");
const user_subscriber_1 = __importDefault(require("../subscribers/user.subscriber"));
let AttachUserSubscriberMiddleware = class AttachUserSubscriberMiddleware {
    async consume(req, res, next) {
        const { connection } = req.scope.resolve(medusa_extender_1.MEDUSA_RESOLVER_KEYS.manager);
        medusa_extender_1.Utils.attachOrReplaceEntitySubscriber(connection, user_subscriber_1.default);
        return next();
    }
};
AttachUserSubscriberMiddleware = __decorate([
    (0, medusa_extender_1.Middleware)({ requireAuth: false, routes: [{ method: "post", path: '/admin/users' }, { method: "post", path: '/admin/create-user' }] })
], AttachUserSubscriberMiddleware);
exports.AttachUserSubscriberMiddleware = AttachUserSubscriberMiddleware;
//# sourceMappingURL=userSubscriber.middleware.js.map