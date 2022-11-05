import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { ShippingMethod as MedusaShippingMethod } from "@medusajs/medusa/dist/models/shipping-method";

@MedusaEntity({override: MedusaShippingMethod})
@Entity()
export class ShippingMethod extends MedusaShippingMethod{
    subtotal?: number
    total?: number
    tax_total?: number
}