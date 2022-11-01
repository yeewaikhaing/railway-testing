import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  Validate,
  ValidateNested,
} from "class-validator"
import { ExactlyOne } from "@medusajs/medusa/dist/types/validators/exactly-one"
import { Region } from "@medusajs/medusa/dist/models/region";
import { DiscountRuleType, AllocationType } from "@medusajs/medusa/dist/models/discount-rule";
import { DiscountConditionOperator } from '@medusajs/medusa/dist/models/discount-condition';

export class AdminUpsertConditionsReq {
    @Validate(ExactlyOne, [
      "product_collections",
      "product_types",
      "product_tags",
      "customer_groups",
    ])
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    products?: string[]
  
    @Validate(ExactlyOne, [
      "products",
      "product_types",
      "product_tags",
      "customer_groups",
    ])
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    product_collections?: string[]
  
    @Validate(ExactlyOne, [
      "product_collections",
      "products",
      "product_tags",
      "customer_groups",
    ])
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    product_types?: string[]
  
    @Validate(ExactlyOne, [
      "product_collections",
      "product_types",
      "products",
      "customer_groups",
    ])
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    product_tags?: string[]
  
    @Validate(ExactlyOne, [
      "product_collections",
      "product_types",
      "products",
      "product_tags",
    ])
    @IsArray()
    @IsOptional()
    @IsString({ each: true })
    customer_groups?: string[]
  }

  export type UpsertDiscountConditionInput = {
    rule_id?: string
    id?: string
    operator?: DiscountConditionOperator
    products?: string[]
    product_collections?: string[]
    product_types?: string[]
    product_tags?: string[]
    customer_groups?: string[]
  }

export type CreateDiscountRuleInput = {
    description?: string
    type: DiscountRuleType
    value: number
    allocation: AllocationType
    conditions?: UpsertDiscountConditionInput[]
  }

export type CreateDiscountInput = {
    code: string
    rule: CreateDiscountRuleInput
    is_dynamic: boolean
    is_disabled: boolean
    starts_at?: Date
    ends_at?: Date
    valid_duration?: string
    usage_limit?: number
    regions?: string[] | Region[]
    metadata?: Record<string, unknown>
  }


  