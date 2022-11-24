import { ManyToOne, Entity, JoinColumn, Column } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { CustomShippingOption as MedusaCustomShippingOption } from "@medusajs/medusa/dist/models/custom-shipping-option";
import { DeliveryArea } from "../../delivery/entities/deliveryArea.entity";

@MedusaEntity({override: MedusaCustomShippingOption})
@Entity()
export class CustomShippingOption extends MedusaCustomShippingOption{
    
    @Column({nullable: true})
    delivery_area_id: string

    @ManyToOne(() => DeliveryArea )
    @JoinColumn({name: 'delivery_area_id', referencedColumnName: 'id'})
    city: DeliveryArea

}