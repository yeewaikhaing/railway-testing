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
exports.AttachInviteSubscriberMiddleware = void 0;
const medusa_extender_1 = require("medusa-extender");
const invite_subscriber_1 = __importDefault(require("./invite.subscriber"));
let AttachInviteSubscriberMiddleware = class AttachInviteSubscriberMiddleware {
    async consume(req, res, next) {
        const { connection } = req.scope.resolve(medusa_extender_1.MEDUSA_RESOLVER_KEYS.manager);
        invite_subscriber_1.default.attachTo(connection);
        return next();
    }
};
AttachInviteSubscriberMiddleware = __decorate([
    (0, medusa_extender_1.Middleware)({ requireAuth: true, routes: [{ method: "post", path: '/admin/invites*' }] })
], AttachInviteSubscriberMiddleware);
exports.AttachInviteSubscriberMiddleware = AttachInviteSubscriberMiddleware;
//# sourceMappingURL=inviteSubscriber.middleware.js.map