import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { LineItem as MedusaLineItem } from "@medusajs/medusa/dist/models/line-item";

@MedusaEntity({override: MedusaLineItem})
@Entity()
export class LineItem extends MedusaLineItem{
    // @Column()
    // name: string;
}