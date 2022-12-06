import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { PaymentSession as MedusaPaymentSession } from "@medusajs/medusa/dist/models/payment-session";

@MedusaEntity({override: MedusaPaymentSession})
@Entity()
export class PaymentSession extends MedusaPaymentSession{
    // @Column()
    // name: string;
}