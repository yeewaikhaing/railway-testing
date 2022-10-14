import { DeliveryArea } from "../../delivery/entities/deliveryArea.entity"


export type CreatePriceGroupInput = {

    name: string
    price: number
    areas?: DeliveryArea[]
  }
  export type UpdatePriceGroupInput = Partial<CreatePriceGroupInput>