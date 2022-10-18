import { EntityEventType, MedusaEventHandlerParams, OnMedusaEntityEvent, Service } from 'medusa-extender';

import { EntityManager } from "typeorm";
import { ProductService as MedusaProductService } from '@medusajs/medusa/dist/services';
import { Product } from '../entities/product.entity';
import { User } from '../../user/entities/user.entity';
import {UserService} from '../../user/services/user.service';
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import { CreateProductInput } from '../types/product';
import { Category } from '../../category/entities/category.entity';
import {ProductRepository, FindWithoutRelationsOptions} from '../repositories/product.repository';
import {FindProductConfig} from '../types/product';
import { buildQuery, isDefined, setMetadata } from "@medusajs/medusa/dist/utils"
import { Selector } from "@medusajs/medusa/dist/types/common";
import { MedusaError } from "medusa-core-utils"
import { formatException } from "@medusajs/medusa/dist/utils/exception-formatter";
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
        let product = productRepo.create(rest)

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

    
    myPrepareListQuery_(selector: object, config: object): object {
        const loggedInUser = Object.keys(this.container).includes('loggedInUser') ? this.container.loggedInUser : null
        if (loggedInUser) {
            selector['store_id'] = loggedInUser.store_id
        }

        return super.prepareListQuery_(selector, config);
    }
}

