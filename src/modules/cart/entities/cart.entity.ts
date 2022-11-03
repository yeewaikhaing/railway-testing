import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Cart as MedusaCart } from "@medusajs/medusa/dist/models/cart";

@MedusaEntity({override: MedusaCart})
@Entity()
export class Cart extends MedusaCart{
    // @Column()
    // name: string;
}