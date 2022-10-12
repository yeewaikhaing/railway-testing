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

    @ManyToOne(() => PriceGroup, (pricing: PriceGroup) => pricing.areas )
    @JoinColumn({name: 'pricing_id'})
    priceGroup: PriceGroup;

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "area");
    }
}
/**
 * @schema city
 * title: "city"
 * description: "Represents a city"
 * required:
 *   - city_name
 * properties:
 *   id:
 *     type: string
 *     description: The city's ID
 *     example: city_01G2SG30J8C85S4A5CHM2S1NS2
 *   city_name:
 *     type: string
 *     description: The city's name
 *   is_disabled:
 *     type: Double
 *     description: The city's price
 *     
 * */