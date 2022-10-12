import { Connection, EntitySubscriberInterface, InsertEvent } from 'typeorm';
import { Invite } from './invite.entity';
export default class InviteSubscriber implements EntitySubscriberInterface<Invite> {
    static attachTo(connection: Connection): void;
    listenTo(): typeof Invite;
    /**
     * Relay the event to the handlers.
     * @param event Event to pass to the event handler
     */
    beforeInsert(event: InsertEvent<Invite>): Promise<void>;
}
