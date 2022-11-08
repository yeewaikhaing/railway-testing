import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { FulfillmentProvider as MedusaFulfillmentProvider } from "@medusajs/medusa/dist/models/fulfillment-provider";

@MedusaEntity({override: MedusaFulfillmentProvider})
@Entity()
export class FulfillmentProvider extends MedusaFulfillmentProvider{
    // @Column()
    // name: string;
}