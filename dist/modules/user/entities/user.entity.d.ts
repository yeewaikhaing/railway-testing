import { User as MedusaUser } from '@medusajs/medusa/dist';
import { Timestamp } from 'typeorm';
import { Store } from '../../store/entities/store.entity';
import { Role } from '../../role/role.entity';
export declare class User extends MedusaUser {
    store_id: string;
    phone: string;
    email_verified_at: Timestamp;
    phone_verified_at: Timestamp;
    store: Store;
    role_id: string;
    teamRole: Role;
}
