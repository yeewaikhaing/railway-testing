import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository,FindManyOptions,Brackets } from "typeorm";
import { PriceGroup } from "./priceGroup.entity";
import { flatten, groupBy, merge } from "lodash";
import {  Selector,ExtendedFindConfig } from "@medusajs/medusa/dist/types/common";

@MedusaRepository()
@EntityRepository(PriceGroup)
export class PriceGroupRepository extends Repository<PriceGroup> {
    
    public async getFreeTextSearchResultsAndCount(
        q: string,
        options: ExtendedFindConfig<PriceGroup, Selector<PriceGroup>> = {
          where: {},
        }
      ): Promise<[PriceGroup[], number]> {
        const options_ = { ...options }
        delete options_?.where?.name
    
        let qb = this.createQueryBuilder("price_group")
          .select()
          .where(options_.where)
          .andWhere(
            new Brackets((qb) => {
              qb.where(`price_group.name ILIKE :q`, {
                q: `%${q}%`,
              }).orWhere(`price_group.price ILIKE :q`, { q: `%${q}%` })
            })
          )
          .skip(options.skip)
          .take(options.take)
    
        if (options.withDeleted) {
          qb = qb.withDeleted()
        }
    
        return await qb.getManyAndCount()
      }
      
    public async findWithRelations(
        relations: (keyof PriceGroup | string)[] = [],
        idsOrOptionsWithoutRelations:
          | Omit<FindManyOptions<PriceGroup>, "relations">
          | string[] = {}
      ): Promise<[PriceGroup[], number]> {
        let entities: PriceGroup[] = []
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

      public async findOneWithRelations(
        relations: Array<keyof PriceGroup> = [],
        optionsWithoutRelations: Omit<
          FindManyOptions<PriceGroup>,
          "relations"
        > = {}
      ): Promise<PriceGroup> {
        // Limit 1
        optionsWithoutRelations.take = 1
    
        const [result] = await this.findWithRelations(
          relations,
          optionsWithoutRelations
        )
        return result[0]
      }
}