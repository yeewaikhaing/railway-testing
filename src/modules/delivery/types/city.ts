
/**
 * Service Level DTOs
 */

 export type CreateCityInput = {
  id: string
  city_name: string
  areas: CreateAreaInput[]
}

export type CreateAreaInput = {
  id: string
  area_name: string
  city_id: string
  pricing_id?: string
}