import {
    IsDate,
    IsNumber,
    IsObject,
    IsOptional,
    IsString,
  } from "class-validator";
  
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
    country_code: string
  
    @IsOptional()
    @IsString()
    province: string
  
    @IsString()
    postal_code: string
  }