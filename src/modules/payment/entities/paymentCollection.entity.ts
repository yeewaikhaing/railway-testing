import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { PaymentCollection as MedusaPaymentCollection } from "@medusajs/medusa/dist/models/payment-collection";

@MedusaEntity({override: MedusaPaymentCollection})
@Entity()
export class PaymentCollection extends MedusaPaymentCollection{
    // @Column()
    // name: string;
}