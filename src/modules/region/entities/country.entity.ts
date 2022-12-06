import { Column, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Country as MedusaCountry } from "@medusajs/medusa";

@MedusaEntity({override: MedusaCountry})
@Entity()
export class Country extends MedusaCountry{
    // @Column()
    // name: string;
}