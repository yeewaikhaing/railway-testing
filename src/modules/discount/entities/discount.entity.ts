import { Entity, Column, ManyToOne, JoinColumn } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Discount as MedusaDiscount } from "@medusajs/medusa/dist";
@MedusaEntity({override: MedusaDiscount})
@Entity()
export class Discount extends MedusaDiscount{
    // @Column()
    // name: string;

    @Column({ nullable: true })
    parent_discount_id: string

    @ManyToOne(() => Discount)
    @JoinColumn({ name: "parent_discount_id" })
    parent_discount: Discount
}