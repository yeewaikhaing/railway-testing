import { UserRepository as MedusaUserRepository } from "@medusajs/medusa/dist/repositories/user";
import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository,Brackets,FindManyOptions } from "typeorm";
import { User } from "../entities/user.entity";
import { flatten, groupBy, merge } from "lodash";
import {  Selector,ExtendedFindConfig } from "@medusajs/medusa/dist/types/common";

@MedusaRepository({ override: MedusaUserRepository })
@EntityRepository(User)
export default class UserRepository extends Utils.repositoryMixin<User, MedusaUserRepository>(MedusaUserRepository) {

  public async findWithRelations(
    relations: (keyof User | string)[] = [],
    idsOrOptionsWithoutRelations:
      | Omit<FindManyOptions<User>, "relations">
      | string[] = {}
  ): Promise<[User[], number]> {
    let entities: User[] = []
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
    relations: Array<keyof User> = [],
    optionsWithoutRelations: Omit<
      FindManyOptions<User>,
      "relations"
    > = {}
  ): Promise<User> {
    // Limit 1
    optionsWithoutRelations.take = 1

    const [result] = await this.findWithRelations(
      relations,
      optionsWithoutRelations
    )
    return result[0]
  }

    public async getFreeTextSearchResultsAndCount(
        q: string,
        options: ExtendedFindConfig<User, Selector<User>> = {
          where: {},
        }
      ): Promise<[User[], number]> {
        const options_ = { ...options }
        console.log("options - ", options_)
        //delete options_?.where?.id
    
        let qb = this.createQueryBuilder("user")
          .leftJoinAndSelect("user.store", "store")
          .select()
          .where(options_.where)
          .andWhere(
            new Brackets((qb) => {
              qb.where(`user.email ILIKE :q`, {
                q: `%${q}%`,
              })
              .orWhere(`user.phone ILIKE :q`, { q: `%${q}%` })
              .orWhere(`user.user_name ILIKE :q`, { q: `%${q}%` })
              .orWhere(`user.first_name ILIKE :q`, { q: `%${q}%` })
              .orWhere(`user.last_name ILIKE :q`, { q: `%${q}%` })
              
            })
          )
          .skip(options.skip)
          .take(options.take)
    
        if (options.withDeleted) {
          qb = qb.withDeleted()
        }
    
        return await qb.getManyAndCount()
      }
}