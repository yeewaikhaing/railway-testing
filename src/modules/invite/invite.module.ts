import { Invite } from "./invite.entity";
import { InviteMigration1662281887790 } from './1662281887790-invite.migration';
import { InviteRepository } from './invite.repository';
import { InviteService } from './invite.service';
import { Module } from "medusa-extender";
import { AttachInviteSubscriberMiddleware } from "./inviteSubscriber.middleware";
import { AcceptInviteRouter } from "./invite.router";
@Module({
  imports: [
    Invite,
    InviteRepository,
    InviteService,
    InviteMigration1662281887790,
    AttachInviteSubscriberMiddleware,
    AcceptInviteRouter,
  ]
})
export class InviteModule {}