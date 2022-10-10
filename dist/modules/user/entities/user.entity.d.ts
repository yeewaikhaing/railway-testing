import { User as MedusaUser } from '@medusajs/medusa/dist';
import { Timestamp } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Role } from '../../role/role.entity';
import { Vendor } from '../../vendor/entities/vendor.entity';
export declare enum CustomUserRoles {
    ADMIN = "admin",
    MEMBER = "member",
    DEVELOPER = "developer",
    VENDOR = "vendor"
}
export declare class User extends MedusaUser {
    custom_role: CustomUserRoles;
    store_id: string;
    phone: string;
    user_name: string;
    email_verified_at: Timestamp;
    phone_verified_at: Timestamp;
    store: Store;
    role_id: string;
    teamRole: Role;
    vendor: Vendor;
}
