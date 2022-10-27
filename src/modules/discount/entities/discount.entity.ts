import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";

@MedusaEntity()
@Entity()
export class Discount {
    @Column()
    name: string;
}