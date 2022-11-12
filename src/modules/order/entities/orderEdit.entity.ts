import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { OrderEdit as MedusaOrderEdit } from "@medusajs/medusa/dist/models/order-edit";

@MedusaEntity({override: MedusaOrderEdit})
@Entity()
export class OrderEdit extends MedusaOrderEdit{
    // @Column()
    // name: string;
}