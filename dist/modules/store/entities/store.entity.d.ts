import { Store as MedusaStore } from '@medusajs/medusa/dist';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/order.entity';
import { Invite } from './../../invite/invite.entity';
import { Role } from '../../role/role.entity';
export declare class Store extends MedusaStore {
    members: User[];
    products: Product[];
    orders: Order[];
    invites: Invite[];
    roles: Role[];
}
