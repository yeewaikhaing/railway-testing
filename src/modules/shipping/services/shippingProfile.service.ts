
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaShippingProfileService} from '@medusajs/medusa/dist/services/shipping-profile';
import { ProductService } from '../../product/services/product.service';
import { ShippingOptionService } from './shippingOption.service';
import { CustomShippingOptionService } from './customShippingOption.service';
import { ShippingProfileRepository } from '../repositories/shippingProfile.repository';
import { ProductRepository } from '../../product/repositories/product.repository';
import { ShippingOption } from '../entities/shippingOption.entity';
import { Selector } from '@medusajs/medusa/dist/types/common';
import { Cart } from '../../cart/entities/cart.entity';
import { ShippingProfile } from '../entities/shippingProfile.entity';

type InjectedDependencies = {
    manager: EntityManager
    productService: ProductService
    shippingOptionService: ShippingOptionService
    customShippingOptionService: CustomShippingOptionService
    shippingProfileRepository: typeof ShippingProfileRepository
    productRepository: typeof ProductRepository
  }
  
  
@Service({override: MedusaShippingProfileService})
export class ShippingProfileService extends MedusaShippingProfileService {
    static resolutionKey = 'shippingProfileService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly shippingProfileRepository: typeof ShippingProfileRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.shippingProfileRepository = container.shippingProfileRepository;
        this.container = container;
        this.manager = container.manager;
    }

    async retrieveDefault(): Promise<ShippingProfile | undefined> {
      const profileRepository = this.manager.getCustomRepository(
        this.shippingProfileRepository
      )
  
      const profile = await profileRepository.findOne({
        where: { type: "default" },
      })
  
      return profile
    }
    /**
   * Returns a list of all the productIds in the cart.
   * @param cart - the cart to extract products from
   * @return a list of product ids
   */
  protected getProfilesInCart(cart: Cart): string[] {
    return cart.items.reduce((acc, next) => {
      // We may have line items that are not associated with a product
      if (next.variant && next.variant.product) {
        if (!acc.includes(next.variant.product.profile_id)) {
          acc.push(next.variant.product.profile_id)
        }
      }

      return acc
    }, [] as string[])
  }
    /**
   * Finds all the shipping profiles that cover the products in a cart, and
   * validates all options that are available for the cart.
   * @param cart - the cart object to find shipping options for
   * @return a list of the available shipping options
   */
  async fetchCartOptions(cart): Promise<ShippingOption[]> {
    return await this.atomicPhase_(async (manager) => {
      const profileIds = this.getProfilesInCart(cart)

      const selector: Selector<ShippingOption> = {
        profile_id: profileIds,
        admin_only: false,
      }

      const customShippingOptions = await this.container.customShippingOptionService
        .withTransaction(manager)
        .list(
          {
            cart_id: cart.id,
          },
          { select: ["id", "shipping_option_id", "price"] }
        )

      const hasCustomShippingOptions = customShippingOptions?.length
      // if there are custom shipping options associated with the cart, use those
      if (hasCustomShippingOptions) {
        selector.id = customShippingOptions.map((cso) => cso.shipping_option_id)
      }

      const rawOpts = await this.container.shippingOptionService
        .withTransaction(manager)
        .list(selector, {
          relations: ["requirements", "profile"],
        })

      // if there are custom shipping options associated with the cart, return cart shipping options with custom price
      if (hasCustomShippingOptions) {
        return rawOpts.map((so) => {
          const customOption = customShippingOptions.find(
            (cso) => cso.shipping_option_id === so.id
          )

          return {
            ...so,
            amount: customOption?.price,
          }
        }) as ShippingOption[]
      }

      const options = await Promise.all(
        rawOpts.map(async (so) => {
          try {
            const option = await this.container.shippingOptionService
              .withTransaction(manager)
              .validateCartOption(so, cart)
            if (option) {
              return option
            }
            return null
          } catch (err) {
            // if validateCartOption fails it means the option is not valid
            return null
          }
        })
      )

      return options.filter(Boolean) as ShippingOption[]
    })
  }

}