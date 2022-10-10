"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggedInUserMiddleware = void 0;
const medusa_extender_1 = require("medusa-extender");
//@Middleware({ requireAuth: true, routes: [{ method: "all", path: '*' }] })
let LoggedInUserMiddleware = class LoggedInUserMiddleware {
    async consume(req, res, next) {
        const userService = req.scope.resolve('userService');
        const loggedInUser = await userService.retrieve(req.user.userId, {
            select: ['id', 'store_id']
        });
        req.scope.register({
            loggedInUser: {
                resolve: () => loggedInUser,
            },
        });
        // console.log("loggedInUser in middle ", loggedInUser);
        next();
    }
};
LoggedInUserMiddleware = __decorate([
    (0, medusa_extender_1.Middleware)({
        requireAuth: true,
        routes: [
            {
                method: "all",
                path: '/admin/*'
            }
        ]
    })
], LoggedInUserMiddleware);
exports.LoggedInUserMiddleware = LoggedInUserMiddleware;
//# sourceMappingURL=loggedInUser.middleware.js.map