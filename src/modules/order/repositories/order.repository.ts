import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { flatten, groupBy, map, merge } from "lodash"
import { EntityRepository, FindManyOptions } from "typeorm";
import { OrderRepository as MedusaOrderRepository } from "@medusajs/medusa/dist/repositories/order";
import { Order } from "../entities/order.entity";

@MedusaRepository({override: MedusaOrderRepository})
@EntityRepository(Order)
export class OrderRepository extends Utils.repositoryMixin<Order, MedusaOrderRepository>(MedusaOrderRepository) {
    public async findOneWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
      ): Promise<Order> {
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
        optionsWithoutRelations: Omit<FindManyOptions<Order>, "relations"> = {}
      ): Promise<Order[]> {
        const entities = await this.find(optionsWithoutRelations)
        const entitiesIds = entities.map(({ id }) => id)
    
        const groupedRelations: { [topLevel: string]: string[] } = {}
        for (const rel of relations) {
          const [topLevel] = rel.split(".")
          if (groupedRelations[topLevel]) {
            groupedRelations[topLevel].push(rel)
          } else {
            groupedRelations[topLevel] = [rel]
          }
        }
    
        const entitiesIdsWithRelations = await Promise.all(
          Object.entries(groupedRelations).map(async ([topLevel, rels]) => {
            return this.findByIds(entitiesIds, {
              select: ["id"],
              relations: rels,
              withDeleted: topLevel === "region",
            })
          })
        ).then(flatten)
    
        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
    
        return map(entities, (e) => merge({}, ...entitiesAndRelationsById[e.id]))
      }
}