import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Refund as MedusaRefund } from "@medusajs/medusa/dist/models/refund";

@MedusaEntity({override: MedusaRefund})
@Entity()
export class Refund extends MedusaRefund{
    // @Column()
    // name: string;
}