"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = exports.defaultAdminUsersRelations = exports.defaultAdminUsersFields = void 0;
const medusa_extender_1 = require("medusa-extender");
const create_user_1 = __importDefault(require("../handlers/create-user"));
const get_user_1 = __importDefault(require("../handlers/get-user"));
const list_user_1 = __importStar(require("../handlers/list-user"));
const update_user_1 = __importStar(require("../handlers/update-user"));
const middlewares_1 = __importStar(require("@medusajs/medusa/dist/api/middlewares"));
const common_1 = require("@medusajs/medusa/dist/types/common");
const delete_user_1 = __importDefault(require("../handlers/delete-user"));
//select properties
exports.defaultAdminUsersFields = [
    "id",
    "email",
    "phone",
    "user_name",
    "first_name",
    "last_name",
    "custom_role",
    "email_verified_at",
    "phone_verified_at",
    "store_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
    "store",
    "vendor",
];
exports.defaultAdminUsersRelations = [
    "store",
    "vendor"
];
let UserRouter = class UserRouter {
};
UserRouter = __decorate([
    (0, medusa_extender_1.Router)({
        routes: [
            /**
             * create a user
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users',
                method: 'post',
                handlers: [
                    middlewares_1.default.authenticate(),
                    middlewares_1.default.wrap(create_user_1.default),
                ],
            },
            /**
             * update a user
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users/:user_id',
                method: 'post',
                handlers: [
                    (0, middlewares_1.transformBody)(update_user_1.AdminUpdateUserRequest),
                    middlewares_1.default.authenticate(),
                    middlewares_1.default.wrap(update_user_1.default),
                ],
            },
            /**
             * delete a user
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users/:user_id',
                method: 'delete',
                handlers: [
                    middlewares_1.default.authenticate(),
                    middlewares_1.default.wrap(delete_user_1.default),
                ],
            },
            /**
             * Get a User
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users/:user_id',
                method: 'get',
                handlers: [
                    middlewares_1.default.authenticate(),
                    (0, middlewares_1.transformQuery)(common_1.EmptyQueryParams, {
                        defaultRelations: exports.defaultAdminUsersRelations,
                        defaultFields: exports.defaultAdminUsersFields,
                        allowedFields: exports.defaultAdminUsersFields,
                        isList: false
                    }),
                    middlewares_1.default.wrap(get_user_1.default)
                ],
            },
            /**
             * List  Users
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users',
                method: 'get',
                handlers: [
                    (0, middlewares_1.transformQuery)(list_user_1.AdminGetUsersParams, {
                        defaultRelations: exports.defaultAdminUsersRelations,
                        defaultFields: exports.defaultAdminUsersFields,
                        allowedFields: exports.defaultAdminUsersFields,
                        isList: true
                    }),
                    middlewares_1.default.authenticate(),
                    middlewares_1.default.wrap(list_user_1.default)
                ],
            },
            // {
            //     requiredAuth: true,
            //     //path: '/admin/create-user',
            //     path: '/admin/v1/users',
            //     method: 'post',
            //     handlers: [wrapHandler(createUserHandler)],
            // },
        ],
    })
], UserRouter);
exports.UserRouter = UserRouter;
//# sourceMappingURL=user.router.js.map