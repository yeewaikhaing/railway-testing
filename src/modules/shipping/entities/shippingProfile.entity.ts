import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { ShippingProfile as MedusaShippingProfile } from "@medusajs/medusa/dist/models/shipping-profile";

@MedusaEntity({override: MedusaShippingProfile})
@Entity()
export class ShippingProfile extends MedusaShippingProfile{
    // @Column()
    // name: string;
}