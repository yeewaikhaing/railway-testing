import { EntityEventType, MedusaEventHandlerParams, OnMedusaEntityEvent, Service } from 'medusa-extender';

import { EntityManager } from "typeorm";
import { ProductService as MedusaProductService } from '@medusajs/medusa/dist/services';
import { Product } from '../entities/product.entity';
import { User } from '../../user/entities/user.entity';
import {UserService} from '../../user/services/user.service';
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import { 
  CreateProductInput,
  FilterableProductProps ,
  FindProductConfig,
  UpdateProductInput
} from '../types/product';
import { Category } from '../../category/entities/category.entity';
import {ProductRepository, FindWithoutRelationsOptions} from '../repositories/product.repository';
import { buildQuery, isDefined, setMetadata } from "@medusajs/medusa/dist/utils"
import { Selector } from "@medusajs/medusa/dist/types/common";
import { MedusaError } from "medusa-core-utils"
import { formatException } from "@medusajs/medusa/dist/utils/exception-formatter";
import {ProductVariant } from "@medusajs/medusa/dist/models/product-variant";
type ConstructorParams = {
    manager: any;
    loggedInUser?: User;
   productRepository: typeof ProductRepository;
    productVariantRepository: any;
    productOptionRepository: any;
    eventBusService: any;
    productVariantService: any;
    productCollectionService: any;
    productTypeRepository: any;
    productTagRepository: any;
    imageRepository: any;
    searchService: any;
    userService: UserService;
    cartRepository: any;
    priceSelectionStrategy: any;
    featureFlagRouter: FlagRouter;
}

@Service({ scope: 'SCOPED', override: MedusaProductService })
export class ProductService extends MedusaProductService {
    static resolutionKey = 'productService';
    readonly #manager: EntityManager;
    private readonly container: ConstructorParams;
    private readonly productRepo: ProductRepository;

    constructor(container: ConstructorParams) {
        // constructor({
        //     manager,
        //     productOptionRepository,
        //     productRepository,
        //     productVariantRepository,
        //     eventBusService,
        //     productVariantService,
        //     productTypeRepository,
        //     productTagRepository,
        //     imageRepository,
        //     searchService,
        //     featureFlagRouter

        // }: ConstructorParams) {
        super(container);
        this.#manager = container.manager;
        //this.productRepo = container.productRepository;
        this.container = container;
        

    }

/**
   * Updates a product. Product variant updates should use dedicated methods,
   * e.g. `addVariant`, etc. The function will throw errors if metadata or
   * product variant updates are attempted.
   * @param {string} productId - the id of the product. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
 async update(
  productId: string,
  update: UpdateProductInput
): Promise<Product> {
  return await this.atomicPhase_(async (manager) => {
    const productRepo = manager.getCustomRepository(this.productRepository_)
    const productVariantRepo = manager.getCustomRepository(
      this.productVariantRepository_
    )
    const productTagRepo = manager.getCustomRepository(
      this.productTagRepository_
    )
    const productTypeRepo = manager.getCustomRepository(
      this.productTypeRepository_
    )
    const imageRepo = manager.getCustomRepository(this.imageRepository_)

    const relations = ["variants", "tags", "images","categories"]

    // if (
    //   this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
    // ) {
    //   if (isDefined(update.sales_channels)) {
    //     relations.push("sales_channels")
    //   }
    // } else {
    //   if (isDefined(update.sales_channels)) {
    //     throw new MedusaError(
    //       MedusaError.Types.INVALID_DATA,
    //       "the property sales_channels should no appears as part of the payload"
    //     )
    //   }
    // }

    const product = await this.retrieve(productId, {
      relations,
    })

    const {
      variants,
      metadata,
      images,
      tags,
      type,
      //sales_channels: salesChannels,
      categories: categories,
      ...rest
    } = update

    if (!product.thumbnail && !update.thumbnail && images?.length) {
      product.thumbnail = images[0]
    }

    if (images) {
      product.images = await imageRepo.upsertImages(images)
    }

    if (metadata) {
      product.metadata = setMetadata(product, metadata)
    }

    if (typeof type !== `undefined`) {
      product.type_id = (await productTypeRepo.upsertType(type))?.id || null
    }

    if (tags) {
      product.tags = await productTagRepo.upsertTags(tags)
    }

    product.categories = [];
    if(categories?.length) {
        const categoryIds = categories?.map((category) => category.id);
        product.categories = categoryIds?.map((id) => ({ id } as Category));
    }
    // if (
    //   this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
    // ) {
    //   if (isDefined(salesChannels)) {
    //     product.sales_channels = []
    //     if (salesChannels?.length) {
    //       const salesChannelIds = salesChannels?.map((sc) => sc.id)
    //       product.sales_channels = salesChannelIds?.map(
    //         (id) => ({ id } as SalesChannel)
    //       )
    //     }
    //   }
    // }

    if (variants) {
      // Iterate product variants and update their properties accordingly
      for (const variant of product.variants) {
        const exists = variants.find((v) => v.id && variant.id === v.id)
        if (!exists) {
          await productVariantRepo.remove(variant)
        }
      }

      const newVariants: ProductVariant[] = []
      for (const [i, newVariant] of variants.entries()) {
        const variant_rank = i

        if (newVariant.id) {
          const variant = product.variants.find((v) => v.id === newVariant.id)

          if (!variant) {
            throw new MedusaError(
              MedusaError.Types.NOT_FOUND,
              `Variant with id: ${newVariant.id} is not associated with this product`
            )
          }

          const saved = await this.productVariantService_
            .withTransaction(manager)
            .update(variant, {
              ...newVariant,
              variant_rank,
              product_id: variant.product_id,
            })

          newVariants.push(saved)
        } else {
          // If the provided variant does not have an id, we assume that it
          // should be created
          const created = await this.productVariantService_
            .withTransaction(manager)
            .create(product.id, {
              ...newVariant,
              variant_rank,
              options: newVariant.options || [],
              prices: newVariant.prices || [],
            })

          newVariants.push(created)
        }
      }

      product.variants = newVariants
    }

    for (const [key, value] of Object.entries(rest)) {
      if (typeof value !== `undefined`) {
        product[key] = value
      }
    }

    const result = await productRepo.save(product)

    await this.eventBus_
      .withTransaction(manager)
      .emit(ProductService.Events.UPDATED, {
        id: result.id,
        fields: Object.keys(update),
      })
    return result
  })
}


/**
   * Lists products based on the provided parameters and includes the count of
   * products that match the query.
   * @param selector - an object that defines rules to filter products
   *   by
   * @param config - object that defines the scope for what should be
   *   returned
   * @return an array containing the products as
   *   the first element and the total count of products that matches the query
   *   as the second element.
   */
 async listAndCount(
  selector: FilterableProductProps | Selector<Product>,
  config: FindProductConfig = {
    relations: [],
    skip: 0,
    take: 20,
    include_discount_prices: false,
  }
): Promise<[Product[], number]> {
  const manager = this.manager_
  const productRepo = manager.getCustomRepository(this.container.productRepository);

  const { q, query, relations } = this.prepareMyListQuery_(selector, config)

  if (q) {
    return await productRepo.getFreeTextSearchResultsAndCount(
      q,
      query,
      relations
    )
  }

  return await productRepo.findWithRelationsAndCount(relations, query)
}


    /**
   * Creates a product.
   * @param productObject - the product to create
   * @return resolves to the creation result.
   */
  async create(productObject: CreateProductInput): Promise<Product> {
    return await this.atomicPhase_(async (manager) => {
      
      const productRepo = manager.getCustomRepository(this.container.productRepository);

      const productTagRepo = manager.getCustomRepository(this.productTagRepository_);
      const productTypeRepo = manager.getCustomRepository(this.productTypeRepository_)
      const imageRepo = manager.getCustomRepository(this.imageRepository_)
      const optionRepo = manager.getCustomRepository(this.productOptionRepository_)

      const {
        options,
        tags,
        type,
        images,
        categories: categories,
        ...rest
      } = productObject

      if (!rest.thumbnail && images?.length) {
        rest.thumbnail = images[0]
      }

      // if product is a giftcard, we should disallow discounts
      if (rest.is_giftcard) {
        rest.discountable = false
      }

      try {
        let product = productRepo.create(rest);
        
        
        if (images?.length) {
          product.images = await imageRepo.upsertImages(images)
        }

        if (tags?.length) {
          product.tags = await productTagRepo.upsertTags(tags)
        }

        if (typeof type !== `undefined`) {
          product.type_id = (await productTypeRepo.upsertType(type))?.id || null
        }

        product.categories = [];
        if(categories?.length) {
            const categoryIds = categories?.map((category) => category.id);
            product.categories = categoryIds?.map((id) => ({ id } as Category));
        }

        // product.sales_channels = []
        // if (salesChannels?.length) {
        //   const salesChannelIds = salesChannels?.map((sc) => sc.id)
        //   product.sales_channels = salesChannelIds?.map(
        //     (id) => ({ id } as SalesChannel)
        //   )
        // }
        

        product = await productRepo.save(product)

        product.options = await Promise.all(
          (options ?? []).map(async (option) => {
            const res = optionRepo.create({
              ...option,
              product_id: product.id,
            })
            await optionRepo.save(res)
            return res
          })
        )

        const result = await this.retrieve(product.id, {
          relations: ["options"],
        })

        await this.eventBus_
          .withTransaction(manager)
          .emit(ProductService.Events.CREATED, {
            id: result.id,
          })
        return result
      } catch (error) {
        throw formatException(error)
      }
    //return result;
    })
  }


  /**
   * Gets a product by id.
   * Throws in case of DB Error and if product was not found.
   * @param productId - id of the product to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve(
    productId: string,
    config: FindProductConfig = {
      include_discount_prices: false,
    }
  ): Promise<Product> {
    return await this.retrieve_({ id: productId }, config)
  }

  /**
   * Gets a product by selector.
   * Throws in case of DB Error and if product was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve_(
    selector: Selector<Product>,
    config: FindProductConfig = {
      include_discount_prices: false,
    }
  ): Promise<Product> {
    const manager = this.manager_
    const productRepo = manager.getCustomRepository(this.container.productRepository);

    const { relations, ...query } = buildQuery(selector, config)

    const product = await productRepo.findOneWithRelations(
      relations,
      query as FindWithoutRelationsOptions
    )

    if (!product) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Product with ${selectorConstraints} was not found`
      )
    }

    return product
  }


    @OnMedusaEntityEvent.Before.Insert(Product, { async: true })
    public async attachStoreToProduct(
        params: MedusaEventHandlerParams<Product, 'Insert'>
    ): Promise<EntityEventType<Product, 'Insert'>> {
        const { event } = params;
        const loggedInUser = this.container.loggedInUser;
        //console.log("loggedInuser in productService: ", loggedInUser);
        
        event.entity.store_id = loggedInUser.store_id;
        return event;
    }

    
    /**
   * Creates a query object to be used for list queries.
   * @param selector - the selector to create the query from
   * @param config - the config to use for the query
   * @return an object containing the query, relations and free-text
   *   search param.
   */
  protected prepareMyListQuery_(
    selector: FilterableProductProps | Selector<Product>,
    config: FindProductConfig
  ): {
    q: string
    relations: (keyof Product)[]
    query: FindWithoutRelationsOptions
  } {

    const loggedInUser = Object.keys(this.container).includes('loggedInUser') ? this.container.loggedInUser : null
    if (loggedInUser) {
          selector['store_id'] = loggedInUser.store_id
      }
    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = buildQuery(selector, config)

    if (config.relations && config.relations.length > 0) {
      query.relations = config.relations
    }

    if (config.select && config.select.length > 0) {
      query.select = config.select
    }

    const rels = query.relations
    delete query.relations

    return {
      query: query as FindWithoutRelationsOptions,
      relations: rels as (keyof Product)[],
      q,
    }
  }
    // myPrepareListQuery_(selector: object, config: object): object {
    //     const loggedInUser = Object.keys(this.container).includes('loggedInUser') ? this.container.loggedInUser : null
    //     if (loggedInUser) {
    //         selector['store_id'] = loggedInUser.store_id
    //     }

    //     return this.overridePrepareListQuery_(selector, config);
    // }

   
  
    
}

