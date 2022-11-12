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
  Selector,
  StringComparisonOperator
} from "@medusajs/medusa/dist/types/common"

import { PriceListLoadConfig } from "./price-list";
import {optionalBooleanMapper} from '@medusajs/medusa/dist/utils/validators/is-boolean';
import {IsType } from '@medusajs/medusa/dist/utils/validators/is-type';
import { ProductOptionValue } from "@medusajs/medusa/dist/models/product-option-value";
import { FindOperator } from "typeorm"
import { PriceList, SalesChannel } from "@medusajs/medusa/dist/models"


export type ProductSelector =
  | FilterableProductProps
  | (Selector<Product> & {
      q?: string
      discount_condition_id?: string
      price_list_id?: string[] | FindOperator<PriceList>
      sales_channel_id?: string[] | FindOperator<SalesChannel>
    })


/**
 * API Level DTOs + Validation rules
 */
 export class FilterableProductProps {
  @IsOptional()
  @IsType([String, [String]])
  id?: string | string[]

  @IsString()
  @IsOptional()
  store_id?: string

  @IsString()
  @IsOptional()
  q?: string

  @IsOptional()
  @IsEnum(ProductStatus, { each: true })
  status?: ProductStatus[]

  @IsArray()
  @IsOptional()
  price_list_id?: string[]

  @IsArray()
  @IsOptional()
  collection_id?: string[]

  @IsArray()
  @IsOptional()
  tags?: string[]

  @IsString()
  @IsOptional()
  title?: string

  @IsString()
  @IsOptional()
  description?: string

  @IsString()
  @IsOptional()
  handle?: string

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => optionalBooleanMapper.get(value.toLowerCase()))
  is_giftcard?: boolean

  @IsString()
  @IsOptional()
  type?: string

  // @FeatureFlagDecorators(SalesChannelFeatureFlag.key, [
  //   IsOptional(),
  //   IsArray(),
  // ])
  // sales_channel_id?: string[]

  @IsArray()
  @IsOptional()
  categories?: string[]

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  created_at?: DateComparisonOperator

  @IsOptional()
  @ValidateNested()
  @Type(() => DateComparisonOperator)
  updated_at?: DateComparisonOperator

  @ValidateNested()
  @IsOptional()
  @Type(() => DateComparisonOperator)
  deleted_at?: DateComparisonOperator
}

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
  commission?: number
  
  hs_code?: string
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
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

export type UpdateProductProductVariantDTO = {
  id?: string
  title?: string
  sku?: string
  ean?: string
  upc?: string
  barcode?: string
  hs_code?: string
  inventory_quantity?: number
  allow_backorder?: boolean
  manage_inventory?: boolean
  weight?: number
  length?: number
  height?: number
  width?: number
  origin_country?: string
  mid_code?: string
  material?: string
  metadata?: Record<string, unknown>
  prices?: CreateProductProductVariantPriceInput[]
  options?: { value: string; option_id: string }[]
}

export type UpdateProductInput = Omit<
  Partial<CreateProductInput>,
  "variants"
> & {
  variants?: UpdateProductProductVariantDTO[]
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

  export class ProductCategoryReq {
    @IsString()
    id: string
  }

  export type FindProductConfig = FindConfig<Product> & PriceListLoadConfig

  export type ProductOptionInput = {
    title: string
    values?: ProductOptionValue[]
  }