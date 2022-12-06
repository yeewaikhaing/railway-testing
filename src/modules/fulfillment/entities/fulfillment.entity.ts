import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Fulfillment as MedusaFulfillment } from "@medusajs/medusa/dist/models/fulfillment";

@MedusaEntity({override: MedusaFulfillment})
@Entity()
export class Fulfillment extends MedusaFulfillment{
    // @Column()
    // name: string;
}