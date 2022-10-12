import { SellerTypes, StoreTypes } from "../entities/store.entity"

export type CreateStoreInput = {
    id?: string
    name: string
    store_logo?: string
    store_type: StoreTypes
    seller_type: SellerTypes
    state_division: string
    city: string
    township: string
    address: string
  }
