import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository,FindManyOptions, } from "typeorm";
import { DeliveryArea } from "../entities/deliveryArea.entity";
import { flatten, groupBy, merge } from "lodash";

@MedusaRepository()
@EntityRepository(DeliveryArea)
export class DeliveryAreaRepository extends Repository<DeliveryArea> {
    public async findOneWithRelations(
        relations: Array<keyof DeliveryArea> = [],
        optionsWithoutRelations: Omit<
          FindManyOptions<DeliveryArea>,
          "relations"
        > = {}
      ): Promise<DeliveryArea> {
        // Limit 1
        optionsWithoutRelations.take = 1
    
        const [result] = await this.findWithRelations(
          relations,
          optionsWithoutRelations
        )
        return result[0]
      }
      public async findWithRelations(
        relations: (keyof DeliveryArea | string)[] = [],
        idsOrOptionsWithoutRelations:
          | Omit<FindManyOptions<DeliveryArea>, "relations">
          | string[] = {}
      ): Promise<[DeliveryArea[], number]> {
        let entities: DeliveryArea[] = []
        let count = 0
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
          entities = await this.findByIds(idsOrOptionsWithoutRelations)
          count = idsOrOptionsWithoutRelations.length
        } else {
          const [results, resultCount] = await this.findAndCount(
            idsOrOptionsWithoutRelations
          )
          entities = results
          count = resultCount
        }
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
          Object.entries(groupedRelations).map(([_, rels]) => {
            return this.findByIds(entitiesIds, {
              select: ["id"],
              relations: rels as string[],
            })
          })
        ).then(flatten)
        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
    
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
        return [
          Object.values(entitiesAndRelationsById).map((v) => merge({}, ...v)),
          count,
        ]
      }
}