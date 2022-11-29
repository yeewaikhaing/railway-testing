import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Payment as MedusaPayment } from "@medusajs/medusa/dist/models/payment";
import { resolveDbType } from "@medusajs/medusa/dist/utils/db-aware-column"

export enum PaymentType {
    COD = "cod",
    PREPAID = "prepaid"
  }
@MedusaEntity({override: MedusaPayment})
@Entity()
export class Payment extends MedusaPayment{
    @Column({nullable: true})
    payment_type: string

    @Column({nullable: true})
    payment_proof: string

    @Column({ type: resolveDbType("timestamptz"), nullable: true })
    payment_transferred_at: Date | string
    
    
}