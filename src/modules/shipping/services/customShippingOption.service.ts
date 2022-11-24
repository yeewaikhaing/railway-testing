import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { CustomShippingOptionRepository } from "../repositories/customShippingOption.repository";
import { default as MedusaCustomShippingOptionService} from "@medusajs/medusa/dist/services/custom-shipping-option";
import { CustomShippingOption } from "../entities/customShippingOption.entity";
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import { buildQuery } from "@medusajs/medusa/dist/utils";
import { CreateCustomShippingOptionAddressInput } from "../types/shipping-options";
//import { CreateCustomShippingOptionInput } from "../types/shipping-options";


type InjectedDependencies = {
    manager: EntityManager
    customShippingOptionRepository: typeof CustomShippingOptionRepository
  }
@Service({override: MedusaCustomShippingOptionService})
export class CustomShippingOptionService extends MedusaCustomShippingOptionService {
    static resolutionKey = 'customShippingOptionService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly customShippingOptionRepository: typeof CustomShippingOptionRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.customShippingOptionRepository = container.customShippingOptionRepository;
        this.manager = container.manager;
    }

    /** Fetches all custom shipping options based on the given selector
   * @param selector - the query object for find
   * @param config - the configuration used to find the objects. contains relations, skip, and take.
   * @return custom shipping options matching the query
   */
  async list(
    selector: Selector<CustomShippingOption>,
    config: FindConfig<CustomShippingOption> = {
      skip: 0,
      take: 50,
      relations: [],
    }
  ): Promise<CustomShippingOption[]> {
    const manager = this.manager_
    const customShippingOptionRepo = manager.getCustomRepository(
      this.customShippingOptionRepository
    )

    const query = buildQuery(selector, config)

    return await customShippingOptionRepo.find(query)
  }

  /**
   * Creates a custom shipping option
   * @param data - the custom shipping option to create
   * @param config - any configurations if needed, including meta data
   * @return resolves to the creation result
   */
   async create(
    data: CreateCustomShippingOptionAddressInput
  ): Promise<CustomShippingOption> {
    const { cart_id, delivery_area_id, shipping_option_id, price, metadata } = data

    const customShippingOptionRepo = this.manager.getCustomRepository(
      this.customShippingOptionRepository
    )

    const customShippingOption = customShippingOptionRepo.create({
      cart_id,
      shipping_option_id,
      delivery_area_id,
      price,
      metadata,
    })
    return await customShippingOptionRepo.save(customShippingOption)
  }
  
  // /**
  //  * Creates a custom shipping option
  //  * @param data - the custom shipping option to create
  //  * @param config - any configurations if needed, including meta data
  //  * @return resolves to the creation result
  //  */
  // async create(
  //   data: CreateCustomShippingOptionInput
  // ): Promise<CustomShippingOption> {
  //   const { cart_id, shipping_option_id, price, metadata } = data

  //   const customShippingOptionRepo = this.manager.getCustomRepository(
  //     this.customShippingOptionRepository
  //   )

  //   const customShippingOption = customShippingOptionRepo.create({
  //     cart_id,
  //     shipping_option_id,
  //     price,
  //     metadata,
  //   })
  //   return await customShippingOptionRepo.save(customShippingOption)
  // }
}