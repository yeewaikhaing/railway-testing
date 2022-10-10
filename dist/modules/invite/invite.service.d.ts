import { ConfigModule } from '@medusajs/medusa/dist/types/global';
import { EntityManager } from 'typeorm';
import { EventBusService } from '@medusajs/medusa';
import { Invite } from './invite.entity';
import { InviteRepository } from './invite.repository';
import { default as MedusaInviteService } from "@medusajs/medusa/dist/services/invite";
import { User } from '../user/entities/user.entity';
import UserRepository from '../user/repositories/user.repository';
import { UserService } from '../user/services/user.service';
declare type InviteServiceProps = {
    manager: EntityManager;
    userService: UserService;
    userRepository: UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
    inviteRepository: InviteRepository;
};
export declare class InviteService extends MedusaInviteService {
    static readonly resolutionKey = "inviteService";
    private readonly manager;
    private readonly container;
    private readonly inviteRepository;
    constructor(container: InviteServiceProps, configModule: ConfigModule);
    customBuildQuery(selector: any, config?: {}): object;
    retrieve(invite_id: string): Promise<Invite | null>;
}
export {};
