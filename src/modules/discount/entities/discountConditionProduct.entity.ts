import { 
  Entity, 
  ManyToOne, 
  JoinColumn, 
  BaseEntity,
  PrimaryColumn,
  CreateDateColumn,
  UpdateDateColumn
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Product } from "../../product/entities/product.entity";
//import { DiscountConditionProduct as MedusaDiscountCondtionProduct } from "@medusajs/medusa/dist/models/discount-condition-product";
import {DiscountCondition} from "../entities/discountCondition.entity";
import { DbAwareColumn,resolveDbType } from "@medusajs/medusa/dist/utils/db-aware-column"
import { SoftDeletableEntity } from "@medusajs/medusa";
@MedusaEntity()
@Entity()
export class DiscountConditionProduct {
    
  @PrimaryColumn()
  product_id: string

  @PrimaryColumn()
  condition_id: string

  @ManyToOne(() => Product, { onDelete: "CASCADE" })
  @JoinColumn({ name: "product_id" })
  product?: Product

  @ManyToOne(() => DiscountCondition, { onDelete: "CASCADE" })
  @JoinColumn({ name: "condition_id" })
  discount_condition?: DiscountCondition

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @UpdateDateColumn({ type: resolveDbType("timestamptz") })
  updated_at: Date

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>
}