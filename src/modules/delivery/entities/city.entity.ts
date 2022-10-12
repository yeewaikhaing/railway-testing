import { 
    Column, 
    Entity,
    BeforeInsert,
    OneToMany,
    JoinColumn
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { DeliveryArea } from "./deliveryArea.entity";

@MedusaEntity()
@Entity()
export class City extends SoftDeletableEntity{
    
    @Column({nullable: false})
    city_name: string;

    @Column({type: "boolean", default: false})
    is_disabled: boolean;

    @OneToMany(() => DeliveryArea, (area: DeliveryArea) => area.city, {cascade: true})
    @JoinColumn({ name: 'id', referencedColumnName: 'city_id' })
    areas: DeliveryArea[];

    @BeforeInsert()
    private beforeInsert(): void {
        this.id = generateEntityId(this.id, "city");
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