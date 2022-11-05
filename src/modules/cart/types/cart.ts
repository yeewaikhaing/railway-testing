import { GiftCard } from "@medusajs/medusa/dist/models/gift-card";
import { CartType } from "@medusajs/medusa/dist/models/cart";
import { Discount } from "../../discount/entities/discount.entity";
import { AddressPayload } from "../../customer/v1/types/address";

export type CartCreateProps = {
    region_id?: string
    email?: string
    billing_address_id?: string
    billing_address?: Partial<AddressPayload>
    shipping_address_id?: string
    shipping_address?: Partial<AddressPayload>
    gift_cards?: GiftCard[]
    discounts?: Discount[]
    customer_id?: string
    type?: CartType
    context?: object
    metadata?: Record<string, unknown>
    sales_channel_id?: string
    country_code?: string
  }

  export type CartUpdateProps = {
    region_id?: string
    country_code?: string
    email?: string
    shipping_address_id?: string
    billing_address_id?: string
    billing_address?: AddressPayload | string
    shipping_address?: AddressPayload | string
    completed_at?: Date
    payment_authorized_at?: Date | null
    gift_cards?: GiftCard[]
    discounts?: Discount[]
    customer_id?: string
    context?: object
    metadata?: Record<string, unknown>
    sales_channel_id?: string
  }