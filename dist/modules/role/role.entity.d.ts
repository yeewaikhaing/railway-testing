import { BaseEntity } from "@medusajs/medusa";
import { Permission } from '../permission/permission.entity';
import { Store } from "../store/entities/store.entity";
import { User } from "../user/entities/user.entity";
export declare class Role extends BaseEntity {
    name: string;
    store_id: string;
    permissions: Permission[];
    users: User[];
    store: Store;
    private beforeInsert;
}
