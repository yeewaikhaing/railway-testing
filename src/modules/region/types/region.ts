export type CreateRegionInput = {
    name: string
    currency_code: string
    tax_code?: string
    tax_rate: number
    payment_providers: string[]
    fulfillment_providers: string[]
    countries: string[]
    includes_tax?: boolean
    metadata?: Record<string, unknown>
  }