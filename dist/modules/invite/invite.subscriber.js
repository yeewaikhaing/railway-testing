"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var InviteSubscriber_1;
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const medusa_extender_1 = require("medusa-extender");
const invite_entity_1 = require("./invite.entity");
let InviteSubscriber = InviteSubscriber_1 = class InviteSubscriber {
    static attachTo(connection) {
        medusa_extender_1.Utils.attachOrReplaceEntitySubscriber(connection, InviteSubscriber_1);
    }
    listenTo() {
        return invite_entity_1.Invite;
    }
    /**
     * Relay the event to the handlers.
     * @param event Event to pass to the event handler
     */
    async beforeInsert(event) {
        return await medusa_extender_1.eventEmitter.emitAsync(medusa_extender_1.OnMedusaEntityEvent.Before.InsertEvent(invite_entity_1.Invite), {
            event,
            transactionalEntityManager: event.manager,
        });
    }
};
InviteSubscriber = InviteSubscriber_1 = __decorate([
    (0, typeorm_1.EventSubscriber)()
], InviteSubscriber);
exports.default = InviteSubscriber;
//# sourceMappingURL=invite.subscriber.js.map