import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { LineItemTaxLine as MedusaLineItemTaxLine } from "@medusajs/medusa/dist/models/line-item-tax-line";

@MedusaEntity({override: MedusaLineItemTaxLine})
@Entity()
export class LineItemTaxLine extends MedusaLineItemTaxLine{
    // @Column()
    // name: string;
}