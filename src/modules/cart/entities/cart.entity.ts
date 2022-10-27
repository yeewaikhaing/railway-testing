import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";

@MedusaEntity()
@Entity()
export class Cart {
    @Column()
    name: string;
}