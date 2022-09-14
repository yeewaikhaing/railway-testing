import { EntityManager } from 'typeorm';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { UserService as MedusaUserService } from '@medusajs/medusa/dist/services';
import { User } from '../entities/user.entity';
import UserRepository from '../repositories/user.repository';
declare type ConstructorParams = {
    manager: EntityManager;
    userRepository: typeof UserRepository;
    eventBusService: EventBusService;
    loggedInUser?: User;
};
export default class UserService extends MedusaUserService {
    private readonly container;
    private readonly manager;
    private readonly userRepository;
    private readonly eventBus;
    constructor(container: ConstructorParams);
    addUserToStore(user_id: any, store_id: any): Promise<void>;
    retrieve(userId: string, config?: FindConfig<User>): Promise<User>;
    buildQuery_(selector: any, config?: {}): object;
    withTransaction(transactionManager: EntityManager): UserService;
}
export {};
