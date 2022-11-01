import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Region as MedusaRegion } from "@medusajs/medusa/dist/models/region";
@MedusaEntity({override: MedusaRegion})
@Entity()
export class Region extends MedusaRegion{
    // @Column()
    // name: string;
}