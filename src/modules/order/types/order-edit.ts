import { OrderEdit } from "../entities/orderEdit.entity"

export const defaultOrderEditFields: (keyof OrderEdit)[] = [
    "id",
    "items",
    "changes",
    "order_id",
    "created_by",
    "created_at",
    "requested_by",
    "requested_at",
    "confirmed_by",
    "confirmed_at",
    "declined_by",
    "declined_reason",
    "declined_at",
    "canceled_by",
    "canceled_at",
    "internal_note",
  ]

  export const storeOrderEditNotAllowedFieldsAndRelations = [
    "internal_note",
    "created_by",
    "confirmed_by",
    "canceled_by",
  ]

  export const defaultOrderEditRelations: string[] = [
    "changes",
    "changes.line_item",
    "changes.original_line_item",
    "items",
    "items.adjustments",
    "items.tax_lines",
  ]

  export const defaultStoreOrderEditRelations = defaultOrderEditRelations.filter(
    (field) => !storeOrderEditNotAllowedFieldsAndRelations.includes(field)
  )

export const defaultStoreOrderEditFields = defaultOrderEditFields.filter(
    (field) => !storeOrderEditNotAllowedFieldsAndRelations.includes(field)
  )