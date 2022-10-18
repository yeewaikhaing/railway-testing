import { ProductStatus } from "@medusajs/medusa/dist/models/product"
import { Transform, Type } from "class-transformer"
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested
} from "class-validator"
import { Product } from "../entities/product.entity"
import {
  DateComparisonOperator,
  FindConfig,
  StringComparisonOperator
} from "@medusajs/medusa/dist/types/common"

import { PriceListLoadConfig } from "./price-list";
/**
 * Service Level DTOs
 */

 export type CreateProductInput = {
  title: string
  categories: CreateProductProductCategoryInput[]
  subtitle?: string
  profile_id?: string
  description?: string
  is_giftcard?: boolean
  discountable?: boolean
  images?: string[]
  thumbnail?: string
  handle?: string
  status?: ProductStatus
  type?: CreateProductProductTypeInput
  collection_id?: string
  tags?: CreateProductProductTagInput[]
  options?: CreateProductProductOption[]
  variants?: CreateProductProductVariantInput[]
  weight?: number
  length?: number
  height?: number
  width?: number
  // hs_code?: string
  // origin_country?: string
  // mid_code?: string
  // material?: string
  // metadata?: Record<string, unknown>
}

export type CreateProductProductCategoryInput = {
  id: string
}

export type CreateProductProductVariantInput = {
  title: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  //hs_code?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  // origin_country?: string
  // mid_code?: string
  // material?: string
  // metadata?: Record<string, unknown>
  prices?: CreateProductProductVariantPriceInput[]
  options?: { value: string }[]
}

export type CreateProductProductOption = {
  title: string
}

export type CreateProductProductTagInput = {
  id?: string
  value: string
}

export type CreateProductProductTypeInput = {
  id?: string
  value: string
}

export type CreateProductProductVariantPriceInput = {
  region_id?: string
  currency_code?: string
  amount: number
 // min_quantity?: number
  //max_quantity?: number
}

export class ProductTagReq {
    @IsString()
    @IsOptional()
    id?: string
  
    @IsString()
    value: string
  }
  
  export class ProductTypeReq {
    @IsString()
    @IsOptional()
    id?: string
  
    @IsString()
    value: string
  }

  export type FindProductConfig = FindConfig<Product> & PriceListLoadConfig