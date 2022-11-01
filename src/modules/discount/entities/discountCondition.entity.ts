import { ManyToMany, JoinTable, Entity } from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { DiscountCondition as MedusaDiscountCondition } from "@medusajs/medusa/dist/models/discount-condition";
import { Product } from "../../product/entities/product.entity";
@MedusaEntity({override: MedusaDiscountCondition})
@Entity()
export class DiscountCondition extends MedusaDiscountCondition{

// @ManyToMany(() => Product)
//   @JoinTable({
//     name: "discount_condition_product",
//     joinColumn: {
//       name: "condition_id",
//       referencedColumnName: "id",
//     },
//     inverseJoinColumn: {
//       name: "product_id",
//       referencedColumnName: "id",
//     },
//   })
//   products: Product[]

}