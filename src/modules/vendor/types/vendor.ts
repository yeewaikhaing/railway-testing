
import { VendorPaymentTypes } from "../entities/vendorPayment.entity";

/**
 * Service Level DTOs
 */

 export type CreateVendorInput = {
  nrcno: string
  primary_phone: string
  secondary_phone?: string
  user_id?: string
  payments?: CreateVendorPaymentInput[]
  
}

export type CreateVendorPaymentInput = {
  id?: string
  payment_type: VendorPaymentTypes
  payment_name: string
  account_holder: string
  account_number?: string
  wallet_number?: string
  vendor_id?: string
}