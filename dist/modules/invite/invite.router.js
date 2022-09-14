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
exports.AcceptInviteRouter = void 0;
const medusa_extender_1 = require("medusa-extender");
const acceptInvite_controller_1 = __importDefault(require("./acceptInvite.controller"));
let AcceptInviteRouter = class AcceptInviteRouter {
};
AcceptInviteRouter = __decorate([
    (0, medusa_extender_1.Router)({
        routes: [
            {
                requiredAuth: false,
                path: '/admin/invites/accept',
                method: 'post',
                handlers: [acceptInvite_controller_1.default],
            },
        ],
    })
], AcceptInviteRouter);
exports.AcceptInviteRouter = AcceptInviteRouter;
//# sourceMappingURL=invite.router.js.map