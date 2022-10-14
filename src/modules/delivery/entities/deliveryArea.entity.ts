import { 
    Column, 
    Entity,
    BeforeInsert,
    ManyToOne,
    Index,
    JoinColumn
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { City } from "./city.entity";
import { PriceGroup } from "../../priceGroup/priceGroup.entity";

@MedusaEntity()
@Entity()
export class DeliveryArea extends SoftDeletableEntity{
    @Column({nullable: false})
    area_name: string;

    @Index()
    @Column({nullable: false})
    city_id: string;

    @ManyToOne(() => City, (city: City) => city.areas )
    @JoinColumn({name: 'city_id'})
    city: City

    @Column({nullable: true})
    pricing_id: string;

    @ManyToOne(() => PriceGroup, (pricing: PriceGroup) => pricing.areas, {eager:true} )
    @JoinColumn({name: 'pricing_id'})
    priceGroup: PriceGroup;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "area");
    }
}
/**
 * @schema area
 * title: "delivery area"
 * description: "Represents a area"
 * required:
 *   - area_name
 *   - city_id
 * properties:
 *   id:
 *     type: string
 *     description: The area's ID
 *     example: area_01G2SG30J8C85S4A5CHM2S1NS2
 *   area_name:
 *     type: string
 *     description: The area's name
 *   city:
 *     type: object
 *     description: The city of area
 *   priceGroup:
 *     type: string
 *     description: The price group of area
 *     
 * */