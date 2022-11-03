import {
   IsBoolean,
    IsOptional,
    IsString,
    IsObject
  } from "class-validator";

  export class AddressPayload {
    @IsOptional()
    @IsString()
    first_name?: string
  
    @IsOptional()
    @IsString()
    last_name?: string
  
    @IsOptional()
    @IsString()
    phone?: string
  
    @IsOptional()
    @IsObject()
    metadata?: Record<string, unknown>
  
    @IsOptional()
    @IsString()
    company?: string
  
    @IsOptional()
    @IsString()
    address_1?: string
  
    @IsOptional()
    @IsString()
    address_2?: string
  
    @IsOptional()
    @IsString()
    city?: string
  
    @IsOptional()
    @IsString()
    country_code?: string
  
    @IsOptional()
    @IsString()
    province?: string
  
    @IsOptional()
    @IsString()
    postal_code?: string
  }
  
export class AddressCreatePayload {
    @IsString()
    first_name: string
  
    @IsString()
    last_name: string
  
    @IsOptional()
    @IsString()
    phone: string
  
    @IsOptional()
    metadata: object
  
    @IsOptional()
    @IsString()
    company: string
  
    @IsString()
    address_1: string
  
    @IsOptional()
    @IsString()
    address_2: string
  
    @IsString()
    city: string
  
    @IsString()
    @IsOptional()
    country_code: string
  
    @IsOptional()
    @IsString()
    province: string
  
    @IsString()
    @IsOptional()
    postal_code: string

    @IsString()
    delivery_area_id: string

    @IsString()
    @IsOptional()
    label: string = 'Default'

    @IsBoolean()
    @IsOptional()
    default_billing: boolean = false

    @IsBoolean()
    @IsOptional()
    default_shipping: boolean = false
  }