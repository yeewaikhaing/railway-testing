import { Invite as MedusaInvite } from "@medusajs/medusa";
import { Store } from "../store/entities/store.entity";
export declare class Invite extends MedusaInvite {
    store_id: string;
    store: Store;
}
