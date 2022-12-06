import { 
    Entity,
    OneToMany 
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Cart as MedusaCart } from "@medusajs/medusa/dist/models/cart";
import { ShippingMethod } from "../../shipping/entities/shippingMethod.entity";

@MedusaEntity({override: MedusaCart})
@Entity()
export class Cart extends MedusaCart{
    
    @OneToMany(() => ShippingMethod, (method) => method.cart, {
        cascade: ["soft-remove", "remove"],
      })
      shipping_methods: ShippingMethod[]
    

    shipping_total?: number
    discount_total?: number
    item_tax_total?: number | null
    shipping_tax_total?: number | null
    tax_total?: number | null
    refunded_total?: number
    total?: number
    subtotal?: number
    refundable_amount?: number
    gift_card_total?: number
    gift_card_tax_total?: number
}