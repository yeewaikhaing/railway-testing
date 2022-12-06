import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { FulfillmentItem as MedusaFulfillmentItem } from "@medusajs/medusa/dist/models/fulfillment-item";

@MedusaEntity({override: MedusaFulfillmentItem})
@Entity()
export class FulfillmentItem extends MedusaFulfillmentItem{
    // @Column()
    // name: string;
}