import { LineItem } from "../../lineItem/entities/lineItem.entity"

export type TotalField =
  | "shipping_total"
  | "discount_total"
  | "tax_total"
  | "refunded_total"
  | "total"
  | "subtotal"
  | "refundable_amount"
  | "gift_card_total"
  | "gift_card_tax_total"

/** The amount of a gift card allocated to a line item */
export type GiftCardAllocation = {
    amount: number
    unit_amount: number
  }
  
  /** The amount of a discount allocated to a line item */
  export type DiscountAllocation = {
    amount: number
    unit_amount: number
  }
  
/**
 * A map of line item ids and its corresponding gift card and discount
 * allocations
 */
 export type LineAllocationsMap = {
    [K: string]: { gift_card?: GiftCardAllocation; discount?: DiscountAllocation }
  }
/**
 * Options to use for subtotal calculations
 */
 export type SubtotalOptions = {
    excludeNonDiscounts?: boolean
  }
  
/**
 * Associates a line item and discount allocation.
 */
 export type LineDiscountAmount = {
    item: LineItem
    amount: number
  }
  