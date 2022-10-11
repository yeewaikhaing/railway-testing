import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsOptional,
    IsString,
    ValidateNested,
  } from "class-validator"
import { Vendor } from "../entities/vendor.entity";
import { VendorPaymentTypes } from "../entities/vendorPayment.entity";
import { FindConfig} from "@medusajs/medusa/dist/types/common";

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
//export type FindVendorConfig = FindConfig<Vendor> & VendorInfoListLoadConfig

// export type VendorInfoListLoadConfig = {
  
//   vendor_id?: string
//   user_id?: string
//   store_id?: string
// }