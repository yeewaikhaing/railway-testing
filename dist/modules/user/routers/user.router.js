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
exports.UserRouter = void 0;
const medusa_extender_1 = require("medusa-extender");
const create_user_1 = __importDefault(require("@medusajs/medusa/dist/api/routes/admin/users/create-user"));
const await_middleware_1 = __importDefault(require("@medusajs/medusa/dist/api/middlewares/await-middleware"));
let UserRouter = class UserRouter {
};
UserRouter = __decorate([
    (0, medusa_extender_1.Router)({
        routes: [
            {
                requiredAuth: false,
                path: '/admin/create-user',
                method: 'post',
                handlers: [(0, await_middleware_1.default)(create_user_1.default)],
            },
        ],
    })
], UserRouter);
exports.UserRouter = UserRouter;
//# sourceMappingURL=user.router.js.map