import { Repository as MedusaRepository, Utils} from "medusa-extender";
import { EntityRepository, FindManyOptions } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartRepository as MedusaCartRepo } from "@medusajs/medusa/dist/repositories/cart";
import { flatten, groupBy, map, merge } from "lodash"

@MedusaRepository({override: MedusaCartRepo})
@EntityRepository(Cart)
export class CartRepository extends Utils.repositoryMixin<Cart, MedusaCartRepo>(MedusaCartRepo)  {
    public async findOneWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: Omit<FindManyOptions<Cart>, "relations"> = {}
      ): Promise<Cart> {
        // Limit 1
        optionsWithoutRelations.take = 1
    
        const result = await this.findWithRelations(
          relations,
          optionsWithoutRelations
        )
        return result[0]
      }

      public async findWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: Omit<FindManyOptions<Cart>, "relations"> = {}
      ): Promise<Cart[]> {
        const entities = await this.find(optionsWithoutRelations)
        const entitiesIds = entities.map(({ id }) => id)
    
        const groupedRelations = {}
        for (const rel of relations) {
          const [topLevel] = rel.split(".")
          if (groupedRelations[topLevel]) {
            groupedRelations[topLevel].push(rel)
          } else {
            groupedRelations[topLevel] = [rel]
          }
        }
    
        const entitiesIdsWithRelations = await Promise.all(
          Object.entries(groupedRelations).map(async ([_, rels]) => {
            return this.findByIds(entitiesIds, {
              select: ["id"],
              relations: rels as string[],
            })
          })
        ).then(flatten)
        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
        return map(entitiesAndRelationsById, (entityAndRelations) =>
          merge({}, ...entityAndRelations)
        )
      }
    
      
}