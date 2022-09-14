import { User as MedusaUser } from '@medusajs/medusa/dist';
import { Store } from '../../store/entities/store.entity';
import { Role } from '../../role/role.entity';
export declare class User extends MedusaUser {
    store_id: string;
    store: Store;
    role_id: string;
    teamRole: Role;
}
