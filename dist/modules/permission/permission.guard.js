"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
exports.default = (permissions) => {
    return async (req, res, next) => {
        const userService = req.scope.resolve('userService');
        const loggedInUser = await userService.retrieve(req.user.userId, {
            select: ['id', 'store_id'],
            relations: ['teamRole', 'teamRole.permissions']
        });
        const isAllowed = permissions.every(permission => { var _a; return (_a = loggedInUser.teamRole) === null || _a === void 0 ? void 0 : _a.permissions.some((userPermission) => lodash_1.default.isEqual(userPermission.metadata, permission)); });
        if (isAllowed) {
            return next();
        }
        //permission denied
        res.sendStatus(401);
    };
};
//# sourceMappingURL=permission.guard.js.map