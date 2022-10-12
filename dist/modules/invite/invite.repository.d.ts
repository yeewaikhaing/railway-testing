import { Invite } from "./invite.entity";
import { InviteRepository as MedusaInviteRepository } from "@medusajs/medusa/dist/repositories/invite";
declare const InviteRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<Invite>, MedusaInviteRepository>;
export declare class InviteRepository extends InviteRepository_base {
}
export {};
