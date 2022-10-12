import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository,FindManyOptions,Brackets, TreeRepository  } from "typeorm";
import { Category } from "../entities/category.entity";
import { flatten, groupBy, merge } from "lodash";
import {  Selector,ExtendedFindConfig } from "@medusajs/medusa/dist/types/common";

@MedusaRepository()
@EntityRepository(Category)
//@TreeRepository(Category)
export class CategoryRepository extends Repository<Category> {
 // export class CategoryRepository extends TreeRepository<Category>{
    
 
    public async getFreeTextSearchResultsAndCount(
        q: string,
        options: ExtendedFindConfig<Category, Selector<Category>> = {
          where: {},
        }
      ): Promise<[Category[], number]> {
        const options_ = { ...options }
        delete options_?.where?.name
    
        let qb = this.createQueryBuilder("category")
          .select()
          .where(options_.where)
          .andWhere(
            new Brackets((qb) => {
              qb.where(`category.name ILIKE :q`, {
                q: `%${q}%`,
              }).orWhere(`category.parent_id ILIKE :q`, { q: `%${q}%` })
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
        relations: (keyof Category | string)[] = [],
        idsOrOptionsWithoutRelations:
          | Omit<FindManyOptions<Category>, "relations">
          | string[] = {}
      ): Promise<[Category[], number]> {
        let entities: Category[] = []
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
        relations: Array<keyof Category> = [],
        optionsWithoutRelations: Omit<
          FindManyOptions<Category>,
          "relations"
        > = {}
      ): Promise<Category> {
        // Limit 1
        optionsWithoutRelations.take = 1
    
        const [result] = await this.findWithRelations(
          relations,
          optionsWithoutRelations
        )
        return result[0]
      }
}