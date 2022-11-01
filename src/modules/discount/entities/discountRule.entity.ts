import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { DiscountRule as MedusaDiscountRule } from "@medusajs/medusa/dist/models/discount-rule";
@MedusaEntity({override: MedusaDiscountRule})
@Entity()
export class DiscountRule extends MedusaDiscountRule{
    // @Column()
    // name: string;
}