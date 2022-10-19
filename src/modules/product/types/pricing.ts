import { Product } from "../entities/product.entity"
import { MoneyAmount } from "@medusajs/medusa/dist/models/money-amount";
import { TaxServiceRate } from "@medusajs/medusa/dist/types/tax-service";
import { ProductVariant } from "@medusajs/medusa/dist/models/product-variant";
import { PriceSelectionContext } from "@medusajs/medusa/dist/interfaces/price-selection-strategy";

export type ProductVariantPricing = {
    prices: MoneyAmount[]
    original_price: number | null
    calculated_price: number | null
    original_price_includes_tax?: boolean | null
    calculated_price_includes_tax?: boolean | null
    calculated_price_type?: string | null
  } & TaxedPricing

  export type TaxedPricing = {
    original_price_incl_tax: number | null
    calculated_price_incl_tax: number | null
    original_tax: number | null
    calculated_tax: number | null
    tax_rates: TaxServiceRate[] | null
  }

export type PricedVariant = Partial<ProductVariant> & ProductVariantPricing

export type PricedProduct = Omit<Partial<Product>, "variants"> & {
    variants: PricedVariant[]
  }
  export type PricingContext = {
    price_selection: PriceSelectionContext
    automatic_taxes: boolean
    tax_rate: number | null
  }