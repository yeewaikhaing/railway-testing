import { Repository as MedusaRepository, Repository, Utils } from "medusa-extender";
import {
     EntityRepository, 
     In,
    Not, } from "typeorm";
import { DiscountConditionRepository as MedusaDiscountConditionRepo } from "@medusajs/medusa/dist/repositories/discount-condition";
import { DiscountCondition } from "../entities/discountCondition.entity";
import { DiscountConditionType } from "@medusajs/medusa/dist/models/discount-condition";
import {DiscountConditionProduct} from "../entities/discountConditionProduct.entity";
import {DiscountConditionProductType} from "@medusajs/medusa/dist/models/discount-condition-product-type";
import {DiscountConditionProductCollection} from "@medusajs/medusa/dist/models/discount-condition-product-collection";
import {DiscountConditionProductTag} from "@medusajs/medusa/dist/models/discount-condition-product-tag";
import {DiscountConditionCustomerGroup} from "@medusajs/medusa/dist/models/discount-condition-customer-group";

//@MedusaRepository({override: MedusaDiscountConditionRepo})
@MedusaRepository()
@EntityRepository(DiscountCondition)
export class DiscountConditionRepository extends Utils.repositoryMixin<DiscountCondition, MedusaDiscountConditionRepo>(MedusaDiscountConditionRepo)  {


    // async addConditionResources(
    //     conditionId: string,
    //     resourceIds: string[],
    //     type: DiscountConditionType,
    //     overrideExisting = false
    //   ): Promise<
    //     (
    //       | DiscountConditionProduct
    //       | DiscountConditionProductType
    //       | DiscountConditionProductCollection
    //       | DiscountConditionProductTag
    //       | DiscountConditionCustomerGroup
    //     )[]
    //   > {
    //     let toInsert: { condition_id: string; [x: string]: string }[] | [] = []
    
    //     const { conditionTable, joinTableForeignKey } =
    //       this.getJoinTableResourceIdentifiers(type)
    
    //     if (!conditionTable || !joinTableForeignKey) {
    //       return Promise.resolve([])
    //     }
    
    //     toInsert = resourceIds.map((rId) => ({
    //       condition_id: conditionId,
    //       [joinTableForeignKey]: rId,
    //     }))
    
    //     const insertResult = await this.createQueryBuilder()
    //       .insert()
    //       .orIgnore(true)
    //       .into(conditionTable)
    //       .values(toInsert)
    //       .execute()
    
    //     if (overrideExisting) {
    //       await this.createQueryBuilder()
    //         .delete()
    //         .from(conditionTable)
    //         .where({
    //           condition_id: conditionId,
    //           [joinTableForeignKey]: Not(In(resourceIds)),
    //         })
    //         .execute()
    //     }
    
    //     return await this.manager
    //       .createQueryBuilder(conditionTable, "discon")
    //       .select()
    //       .where(insertResult.identifiers)
    //       .getMany()
    //   }
    
}