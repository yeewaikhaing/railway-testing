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
exports.UserModule = void 0;
const userSubscriber_middleware_1 = require("./middlewares/userSubscriber.middleware");
//import { UserSubscriber } from './subscribers/user.subscriber';
const _1662297001052_user_migration_1 = require("./1662297001052-user.migration");
const loggedInUser_middleware_1 = require("./middlewares/loggedInUser.middleware");
const medusa_extender_1 = require("medusa-extender");
const user_entity_1 = require("./entities/user.entity");
const user_repository_1 = __importDefault(require("./repositories/user.repository"));
const user_router_1 = require("./routers/user.router");
const user_service_1 = __importDefault(require("./services/user.service"));
const user_migration_1 = __importDefault(require("./user.migration"));
let UserModule = class UserModule {
};
UserModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [
            user_entity_1.User,
            user_service_1.default,
            user_repository_1.default,
            user_migration_1.default,
            user_router_1.UserRouter,
            loggedInUser_middleware_1.LoggedInUserMiddleware,
            userSubscriber_middleware_1.AttachUserSubscriberMiddleware,
            _1662297001052_user_migration_1.UserMigration1662297001052,
            //UserSubscriber
        ]
    })
], UserModule);
exports.UserModule = UserModule;
//# sourceMappingURL=user.module.js.map