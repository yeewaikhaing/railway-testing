import { Column, Entity, JoinColumn, ManyToOne } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Address as MedusaAddress } from "@medusajs/medusa/dist/models/address";
import { DeliveryArea } from "../../../delivery/entities/deliveryArea.entity";
import { Customer } from "./customer.entity";


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

    @ManyToOne(() => DeliveryArea)
    @JoinColumn({name:'delivery_area_id', referencedColumnName: 'id'})
    delivery_area: DeliveryArea;

    @ManyToOne(() => Customer, (cust: Customer) => cust.addresses)
    @JoinColumn({name: 'customer_id'})
    customer: Customer;
}