import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { Product } from '../entities/product.entity';
import { flatten, groupBy, map, merge } from "lodash";
import {
    ExtendedFindConfig,
    Selector,
    WithRequiredProperty,
  } from "@medusajs/medusa/dist/types/common";
  import {
    Brackets,
    EntityRepository,
    FindOperator,
    In,
    Repository,
  } from "typeorm" 
import { PriceList } from "@medusajs/medusa/dist/models/price-list";
export type ProductSelector = Omit<Selector<Product>, "tags"> & {
    tags: FindOperator<string[]>
  }

export type DefaultWithoutRelations = Omit<
  ExtendedFindConfig<Product, ProductSelector>,
  "relations"
>

export type FindWithoutRelationsOptions = DefaultWithoutRelations & {
    where: DefaultWithoutRelations["where"] & {
      price_list_id?: FindOperator<PriceList>
      //sales_channel_id?: FindOperator<SalesChannel>
    }
  }
  
@MedusaRepository({ override: MedusaProductRepository })
@EntityRepository(Product)
export  class ProductRepository extends Utils.repositoryMixin<Product, MedusaProductRepository>(MedusaProductRepository) {

    public async findOneWithRelations(
        relations: string[] = [],
        optionsWithoutRelations: FindWithoutRelationsOptions = { where: {} }
      ): Promise<Product> {
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
        idsOrOptionsWithoutRelations: FindWithoutRelationsOptions | string[] = {
          where: {},
        },
        withDeleted = false
      ): Promise<Product[]> {
        let entities: Product[]
        if (Array.isArray(idsOrOptionsWithoutRelations)) {
          entities = await this.findByIds(idsOrOptionsWithoutRelations, {
            withDeleted,
          })
        } else {
          const result = await this.queryProducts_(
            idsOrOptionsWithoutRelations,
            false
          )
          entities = result[0]
        }
        const entitiesIds = entities.map(({ id }) => id)
    
        if (entitiesIds.length === 0) {
          // no need to continue
          return []
        }
    
        if (
          relations.length === 0 &&
          !Array.isArray(idsOrOptionsWithoutRelations)
        ) {
          return await this.findByIds(entitiesIds, idsOrOptionsWithoutRelations)
        }
    
        const groupedRelations = this.getGroupedRelations_(relations)
        const entitiesIdsWithRelations = await this.queryProductsWithIds_(
          entitiesIds,
          groupedRelations,
          withDeleted
        )
    
        const entitiesAndRelations = entitiesIdsWithRelations.concat(entities)
        const entitiesToReturn =
          this.mergeEntitiesWithRelations_(entitiesAndRelations)
    
        return entitiesToReturn
      }

      private getGroupedRelations_(relations: string[]): {
        [toplevel: string]: string[]
      } {
        const groupedRelations: { [toplevel: string]: string[] } = {}
        for (const rel of relations) {
          const [topLevel] = rel.split(".")
          if (groupedRelations[topLevel]) {
            groupedRelations[topLevel].push(rel)
          } else {
            groupedRelations[topLevel] = [rel]
          }
        }
    
        return groupedRelations
      }
      private async queryProducts_(
        optionsWithoutRelations: FindWithoutRelationsOptions,
        shouldCount = false
      ): Promise<[Product[], number]> {
        const tags = optionsWithoutRelations?.where?.tags
        delete optionsWithoutRelations?.where?.tags
    
        const price_lists = optionsWithoutRelations?.where?.price_list_id
        delete optionsWithoutRelations?.where?.price_list_id
    
        //const sales_channels = optionsWithoutRelations?.where?.sales_channel_id
       // delete optionsWithoutRelations?.where?.sales_channel_id
    
        const qb = this.createQueryBuilder("product")
          .select(["product.id"])
          .skip(optionsWithoutRelations.skip)
          .take(optionsWithoutRelations.take)
    
        if (optionsWithoutRelations.where) {
          qb.where(optionsWithoutRelations.where)
        }
    
        if (optionsWithoutRelations.order) {
          const toSelect: string[] = []
          const parsed = Object.entries(optionsWithoutRelations.order).reduce(
            (acc, [k, v]) => {
              const key = `product.${k}`
              toSelect.push(key)
              acc[key] = v
              return acc
            },
            {}
          )
          qb.addSelect(toSelect)
          qb.orderBy(parsed)
        }
    
        if (tags) {
          qb.leftJoin("product.tags", "tags").andWhere(`tags.id IN (:...tag_ids)`, {
            tag_ids: tags.value,
          })
        }
    
        if (price_lists) {
          qb.leftJoin("product.variants", "variants")
            .leftJoin("variants.prices", "ma")
            .andWhere("ma.price_list_id IN (:...price_list_ids)", {
              price_list_ids: price_lists.value,
            })
        }
    
        // if (sales_channels) {
        //   qb.innerJoin(
        //     "product.sales_channels",
        //     "sales_channels",
        //     "sales_channels.id IN (:...sales_channels_ids)",
        //     { sales_channels_ids: sales_channels.value }
        //   )
        // }
    
        if (optionsWithoutRelations.withDeleted) {
          qb.withDeleted()
        }
    
        let entities: Product[]
        let count = 0
        if (shouldCount) {
          const result = await qb.getManyAndCount()
          entities = result[0]
          count = result[1]
        } else {
          entities = await qb.getMany()
        }
    
        return [entities, count]
      }

      private async queryProductsWithIds_(
        entityIds: string[],
        groupedRelations: { [toplevel: string]: string[] },
        withDeleted = false,
        select: (keyof Product)[] = []
      ): Promise<Product[]> {
        const entitiesIdsWithRelations = await Promise.all(
          Object.entries(groupedRelations).map(async ([toplevel, rels]) => {
            let querybuilder = this.createQueryBuilder("products")
    
            if (select && select.length) {
              querybuilder.select(select.map((f) => `products.${f}`))
            }
    
            if (toplevel === "variants") {
              querybuilder = querybuilder
                .leftJoinAndSelect(
                  `products.${toplevel}`,
                  toplevel,
                  "variants.deleted_at IS NULL"
                )
                .orderBy({
                  "variants.variant_rank": "ASC",
                })
            } else {
              querybuilder = querybuilder.leftJoinAndSelect(
                `products.${toplevel}`,
                toplevel
              )
            }
    
            for (const rel of rels) {
              const [_, rest] = rel.split(".")
              if (!rest) {
                continue
              }
              // Regex matches all '.' except the rightmost
              querybuilder = querybuilder.leftJoinAndSelect(
                rel.replace(/\.(?=[^.]*\.)/g, "__"),
                rel.replace(".", "__")
              )
            }
    
            if (withDeleted) {
              querybuilder = querybuilder
                .where("products.id IN (:...entitiesIds)", {
                  entitiesIds: entityIds,
                })
                .withDeleted()
            } else {
              querybuilder = querybuilder.where(
                "products.deleted_at IS NULL AND products.id IN (:...entitiesIds)",
                {
                  entitiesIds: entityIds,
                }
              )
            }
    
            return querybuilder.getMany()
          })
        ).then(flatten)
    
        return entitiesIdsWithRelations
      }
      private mergeEntitiesWithRelations_(
        entitiesAndRelations: Array<Partial<Product>>
      ): Product[] {
        const entitiesAndRelationsById = groupBy(entitiesAndRelations, "id")
        return map(entitiesAndRelationsById, (entityAndRelations) =>
          merge({}, ...entityAndRelations)
        )
      }   
        
}