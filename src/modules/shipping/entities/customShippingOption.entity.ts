import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { CustomShippingOption as MedusaCustomShippingOption } from "@medusajs/medusa/dist/models/custom-shipping-option";

@MedusaEntity({override: MedusaCustomShippingOption})
@Entity()
export class CustomShippingOption extends MedusaCustomShippingOption{
    // @Column()
    // name: string;
}