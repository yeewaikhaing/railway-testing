import { CustomUserRoles } from "../entities/user.entity";
import { User } from "../entities/user.entity";
import { UserRoles } from "@medusajs/medusa/dist/models/user";
import { PartialPick } from "@medusajs/medusa/dist/types/common";
import { Timestamp } from "typeorm";
import { Store } from "../../store/entities/store.entity";
import { Role } from "../../role/role.entity";
import { Vendor } from "../../vendor/entities/vendor.entity";

export interface CreateUserInput  {
    
    email: string
    password: string
    password_hash?: string
    phone?: string
    user_name?: string
    first_name?: string
    last_name?: string
    api_token?: string
    store_id?: string
    //role?: UserRoles
    custom_role?: CustomUserRoles
    metadata?: Record<string, unknown>
    //store?: Store
    // teamRole?: Role
    // vendor?: Vendor
    
  }
  
  export interface UpdateUserInput  {
    email?: string
    phone?: string
    user_name?: string
    first_name?: string
    last_name?: string
    //custom_role?: CustomUserRoles
    metadata?: Record<string, unknown>
  }

