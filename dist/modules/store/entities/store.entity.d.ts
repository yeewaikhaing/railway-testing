import { Store as MedusaStore } from '@medusajs/medusa/dist';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/order.entity';
import { Invite } from './../../invite/invite.entity';
import { Role } from '../../role/role.entity';
export declare enum StoreTypes {
    ONLINE = "online",
    OFFICIAL_STORE = "offical store",
    AUTHORIZED = "authorized"
}
export declare enum SellerTypes {
    WHOLESALE = "wholesale",
    RETAIL = "retail"
}
export declare class Store extends MedusaStore {
    store_logo: string;
    store_type: StoreTypes;
    seller_type: SellerTypes;
    state_division: string;
    city: string;
    township: string;
    address: string;
    members: User[];
    products: Product[];
    orders: Order[];
    invites: Invite[];
    roles: Role[];
}
