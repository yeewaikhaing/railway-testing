import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository,FindManyOptions,Brackets } from "typeorm";
import { Vendor } from "../entities/vendor.entity";
import { flatten, groupBy, merge } from "lodash";
import {  Selector,ExtendedFindConfig } from "@medusajs/medusa/dist/types/common";

@MedusaRepository()
@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor> {

  public async getFreeTextSearchResultsAndCount(
    q: string,
    options: ExtendedFindConfig<Vendor, Selector<Vendor>> = {
      where: {},
    }
  ): Promise<[Vendor[], number]> {
    const options_ = { ...options }
    delete options_?.where?.id

    let qb = this.createQueryBuilder("vendor")
      .leftJoinAndSelect("vendor.user", "users")
      .leftJoinAndSelect("vendor.user.store", "stores")
      .select()
      .where(options_.where)
      .andWhere(
        new Brackets((qb) => {
          qb.where(`vendor.primary_phone ILIKE :q`, {q: `%${q}%`})
            .orWhere(`vendor.secondary_phone ILIKE :q`, { q: `%${q}%` })
            .orWhere(`users.first_name ILIKE :q`, { q: `%${q}%` })
        })
      )
      .skip(options.skip)
      .take(options.take)

    if (options.withDeleted) {
      qb = qb.withDeleted()
    }

    return await qb.getManyAndCount()
  }
  
    public async findOneWithRelations(
        relations: Array<keyof Vendor> = [],
        optionsWithoutRelations: Omit<
          FindManyOptions<Vendor>,
          "relations"
        > = {}
      ): Promise<Vendor> {
        // Limit 1
        optionsWithoutRelations.take = 1
    
        const [result] = await this.findWithRelations(
          relations,
          optionsWithoutRelations
        )
        return result[0]
      }
      public async findWithRelations(
        relations: (keyof Vendor | string)[] = [],
        idsOrOptionsWithoutRelations:
          | Omit<FindManyOptions<Vendor>, "relations">
          | string[] = {}
      ): Promise<[Vendor[], number]> {
        let entities: Vendor[] = []
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