import {
    BeforeInsert,
    Column,
    Entity,
    Index,
    JoinColumn,
    JoinTable,
    ManyToMany,
    OneToMany,
    OneToOne,
    Timestamp,
  } from "typeorm"
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa/dist/interfaces/models/soft-deletable-entity";
import { User } from "../../user/entities/user.entity";
import { VendorPayment } from "./vendorPayment.entity";

@MedusaEntity()
@Entity()
export class Vendor extends SoftDeletableEntity{
   
    @Column({nullable: false})
    nrcno: string;

    @Column({nullable: true})
    primary_phone: string;

    @Column({nullable: true})
    secondary_phone: string;

    @Column({nullable: true,type: "time with time zone"})
    initial_join_date: Timestamp;

    @Column()
    user_id: string;

    @OneToOne(() => User, (user: User) => user.vendor)
    @JoinColumn({ name: 'user_id'})
    user: User;

   
    @OneToMany(() => VendorPayment, (payment: VendorPayment) => payment.vendor)
    @JoinColumn({name: "id", referencedColumnName: "vendor_id"})
    payments: VendorPayment[];
    
}