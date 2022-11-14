import { ClaimOrder } from "@medusajs/medusa"
import { Address } from "../../customer/v1/entities/address.entity"
import { Discount } from "../../discount/entities/discount.entity"
import { LineItem } from "../../lineItem/entities/lineItem.entity"
import { Payment } from "../../payment/entities/payment.entity"
import { Region } from "../../region/entities/region.entity"
import { ShippingMethod } from "../../shipping/entities/shippingMethod.entity"

export type CreateShipmentConfig = {
  metadata?: Record<string, unknown>
  no_notification?: boolean
}


export type FulfillmentItemPartition = {
    shipping_method: ShippingMethod
    items: LineItem[]
  }
  
export type FulFillmentItemType = {
    item_id: string
    quantity: number
  }

  export type CreateFulfillmentOrder = Omit<ClaimOrder, "beforeInsert"> & {
    is_claim?: boolean
    email?: string
    payments: Payment[]
    discounts: Discount[]
    currency_code: string
    tax_rate: number | null
    region_id: string
    region?: Region
    is_swap?: boolean
    display_id: number
    billing_address: Address
    items: LineItem[]
    shipping_methods: ShippingMethod[]
    no_notification: boolean
  }