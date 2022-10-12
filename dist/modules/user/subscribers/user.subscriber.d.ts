import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { User } from '../entities/user.entity';
export default class UserSubscriber implements EntitySubscriberInterface<User> {
    static attachTo(connection: Connection): void;
    listenTo(): typeof User;
    beforeInsert(event: InsertEvent<User>): Promise<void>;
}
