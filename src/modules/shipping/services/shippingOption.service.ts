import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import {default as MedusaShippingOptionService} from "@medusajs/medusa/dist/services/shipping-option";
import { RegionService } from '../../region/services/region.service';
import { ShippingOptionRepository } from '../repositories/shippingOption.repository';
import { ShippingMethodRepository } from '../repositories/shippingMethod.repository';
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import  FulfillmentProviderService  from '@medusajs/medusa/dist/services/fulfillment-provider';
import { ShippingOptionRequirementRepository } from '@medusajs/medusa/dist/repositories/shipping-option-requirement';
import { ShippingOption } from '../entities/shippingOption.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/order.entity';
import { ShippingMethod } from '../entities/shippingMethod.entity';

type InjectedDependencies = {
    manager: EntityManager
    fulfillmentProviderService: FulfillmentProviderService
    regionService: RegionService
    // eslint-disable-next-line max-len
    shippingOptionRequirementRepository: typeof ShippingOptionRequirementRepository
    shippingOptionRepository: typeof ShippingOptionRepository
    shippingMethodRepository: typeof ShippingMethodRepository
    featureFlagRouter: FlagRouter
  }

@Service()
export class ShippingOptionService extends MedusaShippingOptionService {
    static resolutionKey = 'shippingOptionService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly shippingOptionRepository: typeof ShippingOptionRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.shippingOptionRepository = container.shippingOptionRepository;
    }

     /**
   * Removes a given shipping method
   * @param {ShippingMethod | Array<ShippingMethod>} shippingMethods - the shipping method to remove
   * @returns removed shipping methods
   */
  async deleteShippingMethods(
    shippingMethods: ShippingMethod | ShippingMethod[]
  ): Promise<ShippingMethod[]> {
    const removeEntities: ShippingMethod[] = Array.isArray(shippingMethods)
      ? shippingMethods
      : [shippingMethods]

    return await this.atomicPhase_(async (manager) => {
      const methodRepo = manager.getCustomRepository(this.container.shippingMethodRepository)
      return await methodRepo.remove(removeEntities)
    })
  }


    /**
   * Returns the amount to be paid for a shipping method. Will ask the
   * fulfillment provider to calculate the price if the shipping option has the
   * price type "calculated".
   * @param {ShippingOption} option - the shipping option to retrieve the price
   *   for.
   * @param {ShippingData} data - the shipping data to retrieve the price.
   * @param {Cart | Order} cart - the context in which the price should be
   *   retrieved.
   * @return {Promise<Number>} the price of the shipping option.
   */
  async getPrice_(
    option: ShippingOption,
    data: Record<string, unknown>,
    cart: Cart | Order | undefined
  ): Promise<number> {
    if (option.price_type === "calculated") {
      return this.providerService_.calculatePrice(option, data, cart)
    }
    return option.amount as number
  }
}