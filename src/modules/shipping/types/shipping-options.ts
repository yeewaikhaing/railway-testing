import { ShippingOptionPriceType } from "@medusajs/medusa/dist/models/shipping-option";
import { ShippingOptionRequirement } from "@medusajs/medusa/dist/models/shipping-option-requirement";
import { Cart } from "../../cart/entities/cart.entity";
import { Order } from "../../order/entities/order.entity";

export type CreateShippingMethod = {
    data?: any
    shipping_option_id?: string
    price?: number
    return_id?: string
    swap_id?: string
    cart_id?: string
    order_id?: string
    draft_order_id?: string
    claim_order_id?: string
  }
  
export type CreateShippingMethodDto = CreateShippingMethod & {
    cart?: Cart
    order?: Order
  }

  export type CreateOptionRequirement = {
    type: string
    amount: number
    shipping_option_id?: string
  }

  // export type CreateShippingOptionInput = {
  //   price_type: ShippingOptionPriceType
  //   name: string
  //   region_id: string
  //  // profile_id: string
  //  profile_id?: string
  //   provider_id: string
  //   data: Record<string, unknown>
  //   includes_tax?: boolean
  
  //   amount?: number
  //   is_return?: boolean
  //   admin_only?: boolean
  //   metadata?: Record<string, unknown>
  //   //requirements?: ShippingOptionRequirement[]
  //   requirements?: CreateOptionRequirement[]
  // }

  export type CreateShippingOptionInput = {
    price_type: ShippingOptionPriceType
    name: string
    region_id: string
    profile_id?: string
    provider_id: string
    data: Record<string, unknown>
    includes_tax?: boolean
  
    amount?: number
    is_return?: boolean
    admin_only?: boolean
    metadata?: Record<string, unknown>
    requirements?: ShippingOptionRequirement[]
  }