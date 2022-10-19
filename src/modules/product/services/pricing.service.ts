
import { IPriceSelectionStrategy,PriceSelectionContext } from "@medusajs/medusa/dist/interfaces/price-selection-strategy";
import { ProductVariantService, RegionService, TaxProviderService } from "@medusajs/medusa/dist/services";
import { default as MesusaPricingService } from "@medusajs/medusa/dist/services/pricing";
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import {Product } from '../entities/product.entity';
import 
    {
        PricedProduct,
        PricedVariant,
        PricingContext,
        ProductVariantPricing
    } from '../types/pricing';
import { TaxServiceRate } from '../types/tax-service';
import {ProductVariant } from '@medusajs/medusa/dist/models/product-variant';
  
type InjectedDependencies = {
    manager: EntityManager;
    productVariantService: ProductVariantService
    taxProviderService: TaxProviderService
    regionService: RegionService
    priceSelectionStrategy: IPriceSelectionStrategy
    featureFlagRouter: FlagRouter
};

@Service({override: MesusaPricingService})
export class PricingService extends MesusaPricingService {
    static resolutionKey = 'pricingService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    constructor( container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.manager = container.manager;
        this.container = container;
    }
    /**
   * Set additional prices on a list of products.
   * @param products - list of products on which to set additional prices
   * @param context - the price selection context to use
   * @return A list of products with variants decorated with prices
   */
 async setProductPrices(
    products: Product[],
    context: PriceSelectionContext = {}
  ): Promise<(Product | PricedProduct)[]> {
    const pricingContext = await this.collectPricingContext(context)
    return await Promise.all(
      products.map(async (product) => {
        if (!product?.variants?.length) {
          return product
        }

        const variantPricing = await this.getMyProductPricing_(
          product.id,
          product.variants,
          pricingContext
        )

        const pricedVariants = product.variants.map(
          (productVariant): PricedVariant => {
            const pricing = variantPricing[productVariant.id]
            return {
              ...productVariant,
              ...pricing,
            }
          }
        )

        const pricedProduct = {
          ...product,
          variants: pricedVariants,
        }

        return pricedProduct
      })
    )
  }

  private async getMyProductPricing_(
    productId: string,
    variants: ProductVariant[],
    context: PricingContext
  ): Promise<Record<string, ProductVariantPricing>> {
    const transactionManager = this.transactionManager_ ?? this.manager_
    let taxRates: TaxServiceRate[] = []
    if (context.automatic_taxes && context.price_selection.region_id) {
      taxRates = await this.taxProviderService
        .withTransaction(transactionManager)
        .getRegionRatesForProduct(productId, {
          id: context.price_selection.region_id,
          tax_rate: context.tax_rate,
        })
    }

    const pricings = {}
    await Promise.all(
      variants.map(async ({ id }) => {
        const variantPricing = await this.getMyProductVariantPricing_(
          id,
          taxRates,
          context
        )
        pricings[id] = variantPricing
      })
    )

    return pricings
  }

  private async getMyProductVariantPricing_(
    variantId: string,
    taxRates: TaxServiceRate[],
    context: PricingContext
  ): Promise<ProductVariantPricing> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    context.price_selection.tax_rates = taxRates

    const pricing = await this.priceSelectionStrategy
      .withTransaction(transactionManager)
      .calculateVariantPrice(variantId, context.price_selection)

    const pricingResult: ProductVariantPricing = {
      prices: pricing.prices,
      original_price: pricing.originalPrice,
      calculated_price: pricing.calculatedPrice,
      calculated_price_type: pricing.calculatedPriceType,
      original_price_includes_tax: pricing.originalPriceIncludesTax,
      calculated_price_includes_tax: pricing.calculatedPriceIncludesTax,
      original_price_incl_tax: null,
      calculated_price_incl_tax: null,
      original_tax: null,
      calculated_tax: null,
      tax_rates: null,
    }

    if (context.automatic_taxes && context.price_selection.region_id) {
      const taxResults = await this.calculateTaxes(pricingResult, taxRates)

      pricingResult.original_price_incl_tax = taxResults.original_price_incl_tax
      pricingResult.calculated_price_incl_tax =
        taxResults.calculated_price_incl_tax
      pricingResult.original_tax = taxResults.original_tax
      pricingResult.calculated_tax = taxResults.calculated_tax
      pricingResult.tax_rates = taxResults.tax_rates
    }

    return pricingResult
  }

}