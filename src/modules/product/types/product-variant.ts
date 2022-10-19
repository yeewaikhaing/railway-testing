import {
    IsBoolean,
    IsInt,
    IsOptional,
    IsString,
    Validate,
    ValidateIf,
    ValidateNested,
  } from "class-validator"
import { XorConstraint } from "@medusajs/medusa/dist/types/validators/xor"
  export type ProductVariantPrice = {
    id?: string
    currency_code?: string
    region_id?: string
    amount: number
    min_quantity?: number
    max_quantity?: number
  }

  export type ProductVariantOption = {
    option_id: string
    value: string
  }

  
export type CreateProductVariantInput = {
    title?: string
    product_id?: string
    sku?: string
    barcode?: string
   // ean?: string
   // upc?: string
  //  variant_rank?: number
    inventory_quantity?: number
    allow_backorder?: boolean
    manage_inventory?: boolean
    // hs_code?: string
    // origin_country?: string
    // mid_code?: string
    // material?: string
    weight?: number
    length?: number
    height?: number
    width?: number
    options: ProductVariantOption[]
    prices: ProductVariantPrice[]
   // metadata?: Record<string, unknown>
  }

  export class ProductVariantPricesCreateReq {
    @Validate(XorConstraint, ["currency_code"])
    region_id?: string
  
    @Validate(XorConstraint, ["region_id"])
    currency_code?: string // MMK
  
    @IsInt()
    amount: number
  
    // @IsOptional()
    // @IsInt()
    // min_quantity?: number
  
    // @IsOptional()
    // @IsInt()
    // max_quantity?: number
  }

  export class ProductVariantPricesUpdateReq {
    @IsString()
    @IsOptional()
    id?: string
  
    @ValidateIf((o) => !o.id)
    @Validate(XorConstraint, ["currency_code"])
    region_id?: string
  
    @ValidateIf((o) => !o.id)
    @Validate(XorConstraint, ["region_id"])
    currency_code?: string
  
    @IsInt()
    amount: number
  
    // @IsOptional()
    // @IsInt()
    // min_quantity?: number
  
    // @IsOptional()
    // @IsInt()
    // max_quantity?: number
  }