import { Store as MedusaStore } from '@medusajs/medusa/dist';
import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';
import { Entity as MedusaEntity } from 'medusa-extender';
import { User } from '../../user/entities/user.entity';
import { Product } from '../../product/entities/product.entity';
import { Order } from '../../order/order.entity';
import { Invite } from './../../invite/invite.entity';
import { Role } from '../../role/role.entity';
export enum StoreTypes {
    ONLINE = "online",
    OFFICIAL_STORE = "offical store",
    AUTHORIZED = "authorized"
  }
export enum SellerTypes {
    WHOLESALE = "wholesale",
    RETAIL = "retail"
}
@MedusaEntity({ override: MedusaStore })
@Entity()
export class Store extends MedusaStore {

    @Column({nullable: true})
    store_logo: string;

    @Column({type: "character varying",nullable: false, default: StoreTypes.ONLINE})
    store_type: StoreTypes;

    @Column({type: "character varying",nullable: false})
    seller_type: SellerTypes;

    @Column({nullable: false})
    state_division: string;

    @Column({nullable: false})
    city: string;

    @Column({nullable: false})
    township: string;

    @Column({nullable:false, type: 'text'})
    address: string;

    
    @OneToMany(() => User, (user) => user.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
    members: User[];
    @OneToMany(() => Product, (product) => product.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
    products: Product[];
    @OneToMany(() => Order, (order) => order.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
    orders: Order[];
    @OneToMany(() => Invite, (invite) => invite.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
    invites: Invite[];

    @OneToMany(() => Role, (role) => role.store)
    @JoinColumn({ name: 'id', referencedColumnName: 'store_id' })
    roles: Role[];



    
}