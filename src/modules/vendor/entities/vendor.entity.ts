import {
    BeforeInsert,
    Column,
    Entity,
    JoinColumn,
    OneToMany,
    OneToOne,
    Timestamp,
  } from "typeorm"
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa/dist/interfaces/models/soft-deletable-entity";
import { User } from "../../user/entities/user.entity";
import { VendorPayment } from "./vendorPayment.entity";
import { generateEntityId } from "@medusajs/medusa/dist/utils";


@MedusaEntity()
@Entity()
export class Vendor extends SoftDeletableEntity{
   
    @Column({nullable: false})
    nrcno: string;

    @Column({nullable: false})
    primary_phone: string;

    @Column({nullable: true})
    secondary_phone: string;

    @Column({nullable: true,type: "time with time zone"})
    initial_join_date: Timestamp;

    @Column({nullable: false})
    user_id: string;

    @OneToOne(() => User, (user: User) => user.vendor)
    @JoinColumn({ name: 'user_id'})
    user: User;

   
    @OneToMany(() => VendorPayment, (payment: VendorPayment) => payment.vendor)
    @JoinColumn({name: "id", referencedColumnName: "vendor_id"})
    payments: VendorPayment[];
    
    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "vid");
    }
}


/**
 * @schema vendor
 * title: "vendor"
 * description: "Represents a vendor "
 * required:
 *   - nrcno
 *   - primary_phone
 *   - secondary_phone
 *   - user
 * properties:
 *   id:
 *     type: string
 *     description: The vendor_payment's ID
 *     example: vid_01G2SG30J8C85S4A5CHM2S1NS2
 *   nrcno:
 *     type: string
 *     description: The vendor's nrcno
 *   primary_phone:
 *     type: string
 *     description: The vendor's primary_phone
 *   secondary_phone:
 *     type: string
 *     description: The vendor's secondary_phone
 *   user:
 *     type: object
 *     description: A user  object. Available if the relation `user` is expanded.
 *     
 * */