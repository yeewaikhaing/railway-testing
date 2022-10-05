import { AttachUserSubscriberMiddleware } from './middlewares/userSubscriber.middleware';
import { AddUsernameMigration1664964311259 } from './migrations/addUsername.migration';
//import {UserValidator}  from '../user/validators/user.validator';
//import { UserSubscriber } from './subscribers/user.subscriber';
import { UserMigration1662297001059 } from './migrations/1662297001052-user.migration';
import { LoggedInUserMiddleware } from "./middlewares/loggedInUser.middleware";
import { Module } from 'medusa-extender';
import { User } from './entities/user.entity';
import UserRepository from './repositories/user.repository';
import { UserRouter } from "./routers/user.router";
import UserService from './services/user.service';
import addStoreIdToUser1644946220401 from './migrations/user.migration';

@Module({
    imports: [
        User,
        UserService,
        UserRepository,
        addStoreIdToUser1644946220401,
        UserRouter,
        LoggedInUserMiddleware,
        AttachUserSubscriberMiddleware,
        UserMigration1662297001059, 
        AddUsernameMigration1664964311259,
    //, UserValidator
    //UserSubscriber
]
})
export class UserModule {}