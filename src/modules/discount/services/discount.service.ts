import { isFuture, isPast } from "@medusajs/medusa/dist/utils/date-helpers"
import { Service } from 'medusa-extender';
import { Brackets,
    DeepPartial,
    EntityManager,
    ILike,
    SelectQueryBuilder, } from 'typeorm';
import { formatException } from "@medusajs/medusa/dist/utils/exception-formatter"
import {default as MedusaDiscountService} from '@medusajs/medusa/dist/services/discount';
import { DiscountRepository } from "../repositories/discount.repository";
import { CustomerService } from "../../customer/v1/services/customer.service";
import { DiscountRuleRepository } from "../repositories/discountRule.repository";
import { GiftCardRepository } from "@medusajs/medusa/dist/repositories/gift-card";
import { DiscountConditionRepository } from "../repositories/discountCondition.repository";
import {DiscountConditionService} from "./discountCondition.service";
import { EventBusService, TotalsService } from "@medusajs/medusa/dist/services";
import { ProductService } from "../../product/services/product.service";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { Discount } from "../entities/discount.entity";
import { buildQuery, setMetadata } from "@medusajs/medusa/dist/utils"
import { CreateDiscountInput, CreateDiscountRuleInput,FilterableDiscountProps } from "../types/discount";
import { isEmpty, omit } from "lodash"
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { MedusaError } from "medusa-core-utils"
import { Region } from "@medusajs/medusa/dist/models/region";
import { RegionService } from "../../region/services/region.service";
import { Cart } from "../../cart/entities/cart.entity";

type InjectedDependencies = {
    manager: EntityManager;
    discountRepository: typeof DiscountRepository;
    customerService: typeof CustomerService;
    discountRuleRepository: typeof DiscountRuleRepository;
    giftCardRepository: typeof GiftCardRepository;
    discountConditionRepository: typeof DiscountConditionRepository;
    discountConditionService: typeof DiscountConditionService;
    totalsService: typeof TotalsService;
    productService: typeof ProductService;
    regionService:  RegionService;
    eventBusService: typeof EventBusService;
    featureFlagRouter: typeof FlagRouter
};


@Service({override: MedusaDiscountService})
export class DiscountService extends MedusaDiscountService {
    static resolutionKey = 'discountService';
    private readonly container: InjectedDependencies;
    private readonly manager: EntityManager;
    private readonly discountConditionService: typeof DiscountConditionService;
    //private readonly regionService:  RegionService;

    constructor(container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.container = container;
       // this.regionService = container.regionService;
        this.discountConditionService = container.discountConditionService;
    }

    hasReachedLimit(discount: Discount): boolean {
      const count = discount.usage_count || 0
      const limit = discount.usage_limit
      return !!limit && count >= limit
    }
  
    hasNotStarted(discount: Discount): boolean {
      return isFuture(discount.starts_at)
    }
  
    hasExpired(discount: Discount): boolean {
      if (!discount.ends_at) {
        return false
      }
  
      return isPast(discount.ends_at)
    }
  
    isDisabled(discount: Discount): boolean {
      return discount.is_disabled
    }
  
    async isValidForRegion(
      discount: Discount,
      region_id: string
    ): Promise<boolean> {
      return await this.atomicPhase_(async () => {
        let regions = discount.regions
  
        if (discount.parent_discount_id) {
          const parent = await this.retrieve(discount.parent_discount_id, {
            relations: ["rule", "regions"],
          })
  
          regions = parent.regions
        }
  
        return regions.find(({ id }) => id === region_id) !== undefined
      })
    }
  
    async canApplyForCustomer(
      discountRuleId: string,
      customerId: string | undefined
    ): Promise<boolean> {
      return await this.atomicPhase_(async (manager: EntityManager) => {
        const discountConditionRepo: DiscountConditionRepository =
          manager.getCustomRepository(this.container.discountConditionRepository)
  
        // Instead of throwing on missing customer id, we simply invalidate the discount
        if (!customerId) {
          return false
        }
  
        const customer = await this.customerService_
          .withTransaction(manager)
          .retrieve(customerId, {
            relations: ["groups"],
          })
  
        return await discountConditionRepo.canApplyForCustomer(
          discountRuleId,
          customer.id
        )
      })
    }
    async validateDiscountForCartOrThrow(
      cart: Cart,
      discount: Discount
    ): Promise<void> {
      return await this.atomicPhase_(async () => {
        if (this.hasReachedLimit(discount)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Discount has been used maximum allowed times"
          )
        }
  
        if (this.hasNotStarted(discount)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Discount is not valid yet"
          )
        }
  
        if (this.hasExpired(discount)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Discount is expired"
          )
        }
  
        if (this.isDisabled(discount)) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "The discount code is disabled"
          )
        }
  
        const isValidForRegion = await this.isValidForRegion(
          discount,
          cart.region_id
        )
        if (!isValidForRegion) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "The discount is not available in current region"
          )
        }
        if (cart.customer_id) {
          const canApplyForCustomer = await this.canApplyForCustomer(
            discount.rule.id,
            cart.customer_id
          )
  
          if (!canApplyForCustomer) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Discount is not valid for customer"
            )
          }
        }
      })
    }
  
    /**
   * Deletes a discount idempotently
   * @param {string} discountId - id of discount to delete
   * @return {Promise} the result of the delete operation
   */
  async delete(discountId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.container.discountRepository);

      const discount = await discountRepo.findOne({ where: { id: discountId } })

      if (!discount) {
        return
      }

      await discountRepo.softRemove(discount)
    })
  }
    /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector: FilterableDiscountProps = {},
    config: FindConfig<Discount> = {
      take: 20,
      skip: 0,
      order: { created_at: "DESC" },
    }
  ): Promise<[Discount[], number]> {
    const manager = this.manager_
    const discountRepo = manager.getCustomRepository(this.container.discountRepository);

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector as Selector<Discount>, config)

    if (q) {
      const where = query.where

      delete where.code

      query.where = (qb: SelectQueryBuilder<Discount>): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where({ code: ILike(`%${q}%`) })
          })
        )
      }
    }

    const [discounts, count] = await discountRepo.findAndCount(query)

    return [discounts, count]
  }
  /**
   * Gets a discount by discount code.
   * @param {string} discountCode - discount code of discount to retrieve
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Discount>} the discount document
   */
   async retrieveByCode(
    discountCode: string,
    config: FindConfig<Discount> = {}
  ): Promise<Discount> {
    const manager = this.manager_
    const discountRepo = manager.getCustomRepository(this.container.discountRepository);

    const normalizedCode = discountCode.toUpperCase().trim()

    let query = buildQuery({ code: normalizedCode, is_dynamic: false }, config)
    let discount = await discountRepo.findOne(query)

    if (!discount) {
      query = buildQuery({ code: normalizedCode, is_dynamic: true }, config)
      discount = await discountRepo.findOne(query)

      if (!discount) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Discount with code ${discountCode} was not found`
        )
      }
    }

    return discount
  }
  
    /**
   * Removes a region from the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to remove
   * @return {Promise} the result of the update operation
   */
  async removeRegion(discountId: string, regionId: string): Promise<Discount> {
    return await this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.container.discountRepository)

      const discount = await this.retrieve(discountId, {
        relations: ["regions"],
      })

      const exists = discount.regions.find((r) => r.id === regionId)
      // If region is not present, we return early
      if (!exists) {
        return discount
      }

      discount.regions = discount.regions.filter((r) => r.id !== regionId)

      return await discountRepo.save(discount)
    })
  }

    /**
   * Adds a region to the discount regions array.
   * @param {string} discountId - id of discount
   * @param {string} regionId - id of region to add
   * @return {Promise} the result of the update operation
   */
  async addRegion(discountId: string, regionId: string): Promise<Discount> {
    return await this.atomicPhase_(async (manager) => {
      const discountRepo = manager.getCustomRepository(this.container.discountRepository)

      const discount = await this.retrieve(discountId, {
        relations: ["regions", "rule"],
      })

      const exists = discount.regions.find((r) => r.id === regionId)
      // If region is already present, we return early
      if (exists) {
        return discount
      }

      if (discount.regions?.length === 1 && discount.rule.type === "fixed") {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Fixed discounts can have one region"
        )
      }

      const region = await this.container.regionService.retrieve(regionId)

      discount.regions = [...discount.regions, region]

      return await discountRepo.save(discount)
    })
  }

/**
   * Gets a discount by id.
   * @param {string} discountId - id of discount to retrieve
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Discount>} the discount
   */
 async retrieve(
  discountId: string,
  config: FindConfig<Discount> = {}
): Promise<Discount> {
  const manager = this.manager_
  const discountRepo = manager.getCustomRepository(this.container.discountRepository)

  const query = buildQuery({ id: discountId }, config)
  const discount = await discountRepo.findOne(query)

  if (!discount) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      `Discount with ${discountId} was not found`
    )
  }

  return discount
}

    /**
   * Creates a discount with provided data given that the data is validated.
   * Normalizes discount code to uppercase.
   * @param {Discount} discount - the discount data to create
   * @return {Promise} the result of the create operation
   */
  async create(discount: CreateDiscountInput): Promise<Discount> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const discountRepo = manager.getCustomRepository(this.container.discountRepository)
      const ruleRepo = manager.getCustomRepository(this.discountRuleRepository_)

      const conditions = discount.rule?.conditions

      const ruleToCreate = omit(discount.rule, ["conditions"])
      const validatedRule: Omit<CreateDiscountRuleInput, "conditions"> =
        this.validateDiscountRule_(ruleToCreate)

      if (
        discount?.regions &&
        discount?.regions.length > 1 &&
        discount?.rule?.type === "fixed"
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Fixed discounts can have one region"
        )
      }
      try {
        if (discount.regions) {
          discount.regions = (await Promise.all(
            discount.regions.map(async (regionId) =>
              this.regionService_.withTransaction(manager).retrieve(regionId)
            )
          )) as Region[]
        }

        const discountRule = ruleRepo.create(validatedRule)
        const createdDiscountRule = await ruleRepo.save(discountRule)

       const created: Discount = discountRepo.create(
        discount as DeepPartial<Discount>
      )
        created.rule = createdDiscountRule

        const result = await discountRepo.save(created)

        if (conditions?.length) {
          await Promise.all(
            conditions.map(async (cond) => {
              await this.discountConditionService_
                .withTransaction(manager)
                .upsertCondition({ rule_id: result.rule_id, ...cond })
            })
          )
        }

        return result
      } catch (error) {
        throw formatException(error)
      }
    })
  }

}