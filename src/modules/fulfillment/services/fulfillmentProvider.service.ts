import { default as MedusaFulfillmentProviderService} from "@medusajs/medusa/dist/services/fulfillment-provider";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { MedusaContainer } from "@medusajs/medusa/dist/types/global"
import { FulfillmentProviderRepository } from "../repositories/fulfillmentProvider.repository";
import BaseFulfillmentService from "medusa-interfaces"
import { ShippingOption } from "../../shipping/entities/shippingOption.entity";
import { Cart } from "../../cart/entities/cart.entity";
import { MedusaError } from "medusa-core-utils"
import { Order } from "../../order/entities/order.entity";
import { ShippingMethod } from "../../shipping/entities/shippingMethod.entity";
import { LineItem } from "../../lineItem/entities/lineItem.entity";
import { CreateFulfillmentOrder } from "../types/fulfillment";
import { Fulfillment } from "../entities/fulfillment.entity";

type FulfillmentProviderKey = `fp_${string}`

type InjectedDependencies = MedusaContainer & {
  fulfillmentProviderRepository: typeof FulfillmentProviderRepository
  manager: EntityManager
} & {
  [key in `${FulfillmentProviderKey}`]: typeof BaseFulfillmentService
}

@Service({override: MedusaFulfillmentProviderService})
export class FulfillmentProviderService extends MedusaFulfillmentProviderService {
    static resolutionKey = 'fulfillmentProviderService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly fulFillmentProviderRepo: FulfillmentProviderRepository
    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
    }

    /**
   * @param providerId - the provider id
   * @return the payment fulfillment provider
   */
  retrieveProvider(providerId: string): typeof BaseFulfillmentService {
    try {
      return this.container_[`fp_${providerId}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${providerId}`
      )
    }
  }

  // async createFulfillment(
  //   method: ShippingMethod,
  //   items: LineItem[],
  //   order: CreateFulfillmentOrder,
  //   fulfillment: Omit<Fulfillment, "beforeInsert">
  // ): Promise<Record<string, unknown>> {
  //   const provider = this.retrieveProvider(method.shipping_option.provider_id)
  //   return provider.createFulfillment(
  //     method.data,
  //     items,
  //     order,
  //     fulfillment
  //   ) as unknown as Record<string, unknown>
  // }

  // async calculatePrice(
  //   option: ShippingOption,
  //   data: Record<string, unknown>,
  //   cart?: Order | Cart
  // ): Promise<number> {
  //   const provider = this.retrieveProvider(option.provider_id)
  //   return provider.calculatePrice(option.data, data, cart) as unknown as number
  // }

  // async validateFulfillmentData(
  //   option: ShippingOption,
  //   data: Record<string, unknown>,
  //   cart: Cart | Record<string, unknown>
  // ): Promise<Record<string, unknown>> {
  //   const provider = this.retrieveProvider(option.provider_id)
  //   return provider.validateFulfillmentData(
  //     option.data,
  //     data,
  //     cart
  //   ) as unknown as Record<string, unknown>
  // }

  
}