import { Column, Entity, JoinColumn, ManyToOne,BeforeInsert } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { Vendor } from "./vendor.entity";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

export enum VendorPaymentTypes {
    WALLET = "wallet",
    MOBILE_BANKING = "mobile banking"
  }

@MedusaEntity()
@Entity("vendor_payment")
export class VendorPayment extends SoftDeletableEntity{
    
    @Column({type: "character varying",nullable: false,name: 'payment_type'})
    payment_type: VendorPaymentTypes;

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

    @ManyToOne(() => Vendor, (vendor: Vendor) => vendor.payments)
    @JoinColumn({name: "vendor_id"})
    vendor: Vendor;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "pay");
    }
}

/**
 * @schema vendor payment
 * title: "vendor payment"
 * description: "Represents a vendor payment"
 * required:
 *   - payment_name
 *   - account_holder
 *   - vendor_id
 * properties:
 *   id:
 *     type: string
 *     description: The vendor_payment's ID
 *     example: pay_01G2SG30J8C85S4A5CHM2S1NS2
 *   payment_name:
 *     type: string
 *     description: The vendor_payment's name
 *   account_holder:
 *     type: string
 *     description: The vendor_payment's account_holder
 *   account_number:
 *     type: string
 *     description: The vendor_payment's account_number
 *   wallet_number:
 *     type: string
 *     description: The vendor_payment's wallet_number
 *     
 * */