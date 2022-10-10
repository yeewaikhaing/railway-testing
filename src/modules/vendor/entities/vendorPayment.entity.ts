import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { Vendor } from "./vendor.entity";

@MedusaEntity()
@Entity()
export class VendorPayment extends SoftDeletableEntity{
    
    @Column({nullable: false})
    payment_name: string;

    @Column({nullable: false})
    account_holder: string;

    @Column({nullable: true})
    account_number: string;

    @Column({nullable: true})
    wallet_number: string;

    @Column({nullable: false})
    vendor_id: string;

    @ManyToOne(() => Vendor, (vendor: Vendor) => vendor.payments )
    @JoinColumn({name: "vendor_id"})
    vendor: Vendor;
}