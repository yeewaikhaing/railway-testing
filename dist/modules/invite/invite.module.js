"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InviteModule = void 0;
const invite_entity_1 = require("./invite.entity");
const _1662281887790_invite_migration_1 = require("./1662281887790-invite.migration");
const invite_repository_1 = require("./invite.repository");
const invite_service_1 = require("./invite.service");
const medusa_extender_1 = require("medusa-extender");
const inviteSubscriber_middleware_1 = require("./inviteSubscriber.middleware");
const invite_router_1 = require("./invite.router");
let InviteModule = class InviteModule {
};
InviteModule = __decorate([
    (0, medusa_extender_1.Module)({
        imports: [
            invite_entity_1.Invite,
            invite_repository_1.InviteRepository,
            invite_service_1.InviteService,
            _1662281887790_invite_migration_1.InviteMigration1662281887790,
            inviteSubscriber_middleware_1.AttachInviteSubscriberMiddleware,
            invite_router_1.AcceptInviteRouter,
        ]
    })
], InviteModule);
exports.InviteModule = InviteModule;
//# sourceMappingURL=invite.module.js.map