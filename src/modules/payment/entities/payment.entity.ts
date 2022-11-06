import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Payment as MedusaPayment } from "@medusajs/medusa/dist/models/payment";

@MedusaEntity({override: MedusaPayment})
@Entity()
export class Payment extends MedusaPayment{
    // @Column()
    // name: string;
}