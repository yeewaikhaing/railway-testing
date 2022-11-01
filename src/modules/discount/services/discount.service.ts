import { BaseService } from "medusa-interfaces";
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
import { EventBusService, RegionService, TotalsService } from "@medusajs/medusa/dist/services";
import { ProductService } from "../../product/services/product.service";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { Discount } from "../entities/discount.entity";
import { buildQuery, setMetadata } from "@medusajs/medusa/dist/utils"
import { CreateDiscountInput, CreateDiscountRuleInput } from "../types/discount";
import { isEmpty, omit } from "lodash"
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { MedusaError } from "medusa-core-utils"
import { Region } from "@medusajs/medusa/dist/models/region";

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
    regionService: typeof RegionService;
    eventBusService: typeof EventBusService;
    featureFlagRouter: typeof FlagRouter
};


@Service({override: MedusaDiscountService})
export class DiscountService extends MedusaDiscountService {
    static resolutionKey = 'discountService';
    private readonly container: InjectedDependencies;
    private readonly manager: EntityManager;
    private readonly discountConditionService: typeof DiscountConditionService;

    constructor(container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.container = container;
        this.discountConditionService = container.discountConditionService;
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