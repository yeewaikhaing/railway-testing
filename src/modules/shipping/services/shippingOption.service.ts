import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager, DeepPartial } from 'typeorm';
import {default as MedusaShippingOptionService} from "@medusajs/medusa/dist/services/shipping-option";
import { RegionService } from '../../region/services/region.service';
import { ShippingOptionRepository } from '../repositories/shippingOption.repository';
import { ShippingMethodRepository } from '../repositories/shippingMethod.repository';
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import { ShippingOptionRequirementRepository } from '@medusajs/medusa/dist/repositories/shipping-option-requirement';
import { ShippingOption } from '../entities/shippingOption.entity';
import { Cart } from '../../cart/entities/cart.entity';
import { Order } from '../../order/entities/order.entity';
import { ShippingMethod } from '../entities/shippingMethod.entity';
import {CreateShippingMethodDto, CreateShippingOptionInput} from "../types/shipping-options";
import { FulfillmentProviderService } from '../../fulfillment/services/fulfillmentProvider.service';
import TaxInclusivePricingFeatureFlag from "@medusajs/medusa/dist/loaders/feature-flags/tax-inclusive-pricing"
import { buildQuery, isDefined, setMetadata } from "@medusajs/medusa/dist/utils"
import { ExtendedFindConfig, FindConfig, Selector } from '@medusajs/medusa/dist/types/common';
import { ShippingOptionPriceType } from '@medusajs/medusa/dist/models/shipping-option';
import { ShippingOptionRequirement } from '@medusajs/medusa/dist/models/shipping-option-requirement';

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
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param {string} optionId - the id of the profile to get.
   * @param {object} options - the options to get a profile
   * @return {Promise<Product>} the profile document.
   */
  async retrieve(
    optionId,
    options: { select?: (keyof ShippingOption)[]; relations?: string[] } = {}
  ): Promise<ShippingOption> {
    const manager = this.manager_
    const soRepo: ShippingOptionRepository = manager.getCustomRepository(
      this.shippingOptionRepository
    )

    const query: ExtendedFindConfig<ShippingOption> = {
      where: { id: optionId },
    }

    if (options.select) {
      query.select = options.select
    }

    if (options.relations) {
      query.relations = options.relations
    }

    const option = await soRepo.findOne(query)

    if (!option) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Shipping Option with ${optionId} was not found`
      )
    }

    return option
  }
    
    /**
   * Creates a new shipping option. Used both for outbound and inbound shipping
   * options. The difference is registered by the `is_return` field which
   * defaults to false.
   * @param {ShippingOption} data - the data to create shipping options
   * @return {Promise<ShippingOption>} the result of the create operation
   */
  async create(data: CreateShippingOptionInput): Promise<ShippingOption> {
    return this.atomicPhase_(async (manager) => {
      const optionRepo = manager.getCustomRepository(this.shippingOptionRepository)
      const option = optionRepo.create(data as DeepPartial<ShippingOption>)

      const region = await this.container.regionService
        .withTransaction(manager)
        .retrieve(option.region_id, {
          relations: ["fulfillment_providers"],
        })

      if (
        !region.fulfillment_providers.find(
          ({ id }) => id === option.provider_id
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider is not available in the provided region"
        )
      }

      option.price_type = await this.validatePriceType_(data.price_type, option)
      option.amount =
        data.price_type === "calculated" ? null : data.amount ?? null

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        )
      ) {
        if (typeof data.includes_tax !== "undefined") {
          option.includes_tax = data.includes_tax
        }
      }

      const isValid = await this.container.fulfillmentProviderService.validateOption(option)

      if (!isValid) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider cannot validate the shipping option"
        )
      }

      if (isDefined(data.requirements)) {
        const acc: ShippingOptionRequirement[] = []
        for (const r of data.requirements) {
          const validated = await this.validateRequirement_(r)

          if (acc.find((raw) => raw.type === validated.type)) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Only one requirement of each type is allowed"
            )
          }

          if (
            acc.find(
              (raw) =>
                (raw.type === "max_subtotal" &&
                  validated.amount > raw.amount) ||
                (raw.type === "min_subtotal" && validated.amount < raw.amount)
            )
          ) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "Max. subtotal must be greater than Min. subtotal"
            )
          }

          acc.push(validated)
        }
      }

      const result = await optionRepo.save(option)
      return result
    })
  }

  /**
   * Validates a requirement
   * @param {ShippingOptionRequirement} requirement - the requirement to validate
   * @param {string} optionId - the id to validate the requirement
   * @return {ShippingOptionRequirement} a validated shipping requirement
   */
   async validateRequirement_(
    requirement: ShippingOptionRequirement,
    optionId: string | undefined = undefined
  ): Promise<ShippingOptionRequirement> {
    return await this.atomicPhase_(async (manager) => {
      if (!requirement.type) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "A Shipping Requirement must have a type field"
        )
      }

      if (
        requirement.type !== "min_subtotal" &&
        requirement.type !== "max_subtotal"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Requirement type must be one of min_subtotal, max_subtotal"
        )
      }

      const reqRepo = manager.getCustomRepository(this.container.shippingOptionRequirementRepository)

      const existingReq = await reqRepo.findOne({
        where: { id: requirement.id },
      })

      if (!existingReq && requirement.id) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "ID does not exist"
        )
      }

      // If no option id is provided, we are currently in the process of creating
      // a new shipping option. Therefore, simply return the requirement, such
      // that the cascading will take care of the creation of the requirement.
      if (!optionId) {
        return requirement
      }

      let req
      if (existingReq) {
        req = await reqRepo.save({
          ...existingReq,
          ...requirement,
        })
      } else {
        const created = reqRepo.create({
          ...requirement,
          shipping_option_id: optionId,
        })

        req = await reqRepo.save(created)
      }

      return req
    })
  }

  /**
   * Validates a shipping option price
   * @param {ShippingOptionPriceType} priceType - the price to validate
   * @param {ShippingOption} option - the option to validate against
   * @return {Promise<ShippingOptionPriceType>} the validated price
   */
   async validatePriceType_(
    priceType: ShippingOptionPriceType,
    option: ShippingOption
  ): Promise<ShippingOptionPriceType> {
    if (
      !priceType ||
      (priceType !== "flat_rate" && priceType !== "calculated")
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The price must be of type flat_rate or calculated"
      )
    }

    if (priceType === "calculated") {
      const canCalculate = await this.container.fulfillmentProviderService.canCalculate(option)
      if (!canCalculate) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "The fulfillment provider cannot calculate prices for this option"
        )
      }
    }

    return priceType
  }

    /**
   * @param {Object} selector - the query object for find
   * @param {object} config - config object
   * @return {Promise} the result of the find operation
   */
  async list(
    selector: Selector<ShippingMethod>,
    config: FindConfig<ShippingOption> = { skip: 0, take: 50 }
  ): Promise<ShippingOption[]> {
    const manager = this.manager_
    const optRepo = manager.getCustomRepository(this.shippingOptionRepository)

    const query = buildQuery(selector, config)
    return optRepo.find(query)
  }

    
    /**
   * Checks if a given option id is a valid option for a cart. If it is the
   * option is returned with the correct price. Throws when region_ids do not
   * match, or when the shipping option requirements are not satisfied.
   * @param {object} option - the option object to check
   * @param {Cart} cart - the cart object to check against
   * @return {ShippingOption} the validated shipping option
   */
  async validateCartOption(
    option: ShippingOption,
    cart: Cart
  ): Promise<ShippingOption | null> {
    if (option.is_return) {
      return null
    }

    if (cart.region_id !== option.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The shipping option is not available in the cart's region"
      )
    }

    const subtotal = cart.subtotal as number

    const requirementResults: boolean[] = option.requirements.map(
      (requirement) => {
        switch (requirement.type) {
          case "max_subtotal":
            return requirement.amount > subtotal
          case "min_subtotal":
            return requirement.amount <= subtotal
          default:
            return true
        }
      }
    )

    if (!requirementResults.every(Boolean)) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The Cart does not satisfy the shipping option's requirements"
      )
    }

    option.amount = await this.getPrice_(option, option.data, cart)

    return option
  }

     /**
   * Creates a shipping method for a given cart.
   * @param {string} optionId - the id of the option to use for the method.
   * @param {object} data - the optional provider data to use.
   * @param {object} config - the cart to create the shipping method for.
   * @return {ShippingMethod} the resulting shipping method.
   */
  async createShippingMethod(
    optionId: string,
    data: Record<string, unknown>,
    config: CreateShippingMethodDto
  ): Promise<ShippingMethod> {
    return await this.atomicPhase_(async (manager) => {
      const option = await this.retrieve(optionId, {
        relations: ["requirements"],
      })

      const methodRepo = manager.getCustomRepository(this.container.shippingMethodRepository)

      if (isDefined(config.cart)) {
        await this.validateCartOption(option, config.cart)
      }

      const validatedData = await this.container.fulfillmentProviderService.validateFulfillmentData(
        option,
        data,
        config.cart || {}
      )

      let methodPrice
      if (typeof config.price === "number") {
        methodPrice = config.price
      } else {
        methodPrice = await this.getPrice_(option, validatedData, config.cart)
      }

      const toCreate: Partial<ShippingMethod> = {
        shipping_option_id: option.id,
        data: validatedData,
        price: methodPrice,
      }

      if (
        this.featureFlagRouter_.isFeatureEnabled(
          TaxInclusivePricingFeatureFlag.key
        )
      ) {
        if (typeof option.includes_tax !== "undefined") {
          toCreate.includes_tax = option.includes_tax
        }
      }

      if (config.order) {
        toCreate.order_id = config.order.id
      }

      if (config.cart) {
        toCreate.cart_id = config.cart.id
      }

      if (config.cart_id) {
        toCreate.cart_id = config.cart_id
      }

      if (config.return_id) {
        toCreate.return_id = config.return_id
      }

      if (config.order_id) {
        toCreate.order_id = config.order_id
      }

      if (config.claim_order_id) {
        toCreate.claim_order_id = config.claim_order_id
      }

      const method = methodRepo.create(toCreate)

      const created = await methodRepo.save(method)

      return (await methodRepo.findOne({
        where: { id: created.id },
        relations: ["shipping_option"],
      })) as ShippingMethod
    })
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
      return this.container.fulfillmentProviderService.calculatePrice(option, data, cart)
    }
    return option.amount as number
  }
}