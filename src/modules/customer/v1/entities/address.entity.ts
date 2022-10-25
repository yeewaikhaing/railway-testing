import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Address as MedusaAddress } from "@medusajs/medusa/dist/models/address";
import { DeliveryArea } from "../../../delivery/entities/deliveryArea.entity";

@MedusaEntity({override: MedusaAddress})
@Entity()
export class Address extends MedusaAddress{
    @Column({nullable: false, default: 'Default'})
    label: string;

    @Column({default: 'false', nullable: false})
    default_billing: boolean;

    @Column({default: 'false', nullable: false})
    default_shipping: boolean;

    @Column({nullable: false})
    delivery_area_id: string;

    @ManyToOne(() => DeliveryArea, (area: DeliveryArea) => area.addresses)
    @JoinColumn({name:'delivery_area_id'})
    delivery_area: DeliveryArea;
}