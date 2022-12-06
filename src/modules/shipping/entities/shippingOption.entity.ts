import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { ShippingOption as MedusaShippingOption } from "@medusajs/medusa/dist/models/shipping-option";

@MedusaEntity({override: MedusaShippingOption})
@Entity()
export class ShippingOption extends MedusaShippingOption{
    // @Column()
    // name: string;
}