/**
 * The tax rate object as configured in Medusa. These may have an unspecified
 * numerical rate as they may be used for lookup purposes in the tax provider
 * plugin.
 */
 export type TaxServiceRate = {
    rate?: number | null
    name: string
    code: string | null
  }
  