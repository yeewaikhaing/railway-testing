import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { DiscountRule } from "../entities/discountRule.entity";
import { DiscountRuleRepository as MedusaDiscountRuleRepo } from "@medusajs/medusa/dist/repositories/discount-rule";
@MedusaRepository({override: MedusaDiscountRuleRepo})
@EntityRepository(DiscountRule)
export class DiscountRuleRepository extends Utils.repositoryMixin<DiscountRule, MedusaDiscountRuleRepo>(MedusaDiscountRuleRepo)  {}