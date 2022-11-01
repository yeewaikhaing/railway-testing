import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import {default as MeudsaRegionService} from "@medusajs/medusa/dist/services/region";
import StoreService from '../../store/services/store.service';
import { 
    EventBusService,
    PaymentProviderService,
    FulfillmentProviderService
} from '@medusajs/medusa/dist/services';
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router"
import { RegionRepository } from '../repositories/region.repository';
import { CountryRepository } from '@medusajs/medusa/dist/repositories/country';
import { CurrencyRepository } from '@medusajs/medusa/dist/repositories/currency';
import { TaxProviderRepository } from '@medusajs/medusa/dist/repositories/tax-provider';
import { PaymentProviderRepository } from '@medusajs/medusa/dist/repositories/payment-provider';
import { FulfillmentProviderRepository } from '@medusajs/medusa/dist/repositories/fulfillment-provider';
import { Region } from '../entities/region.entity';
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common"
import { MedusaError } from "medusa-core-utils"
import {buildQuery} from "@medusajs/medusa/dist/utils";

type InjectedDependencies = {
    manager: EntityManager
    storeService: StoreService
    eventBusService: EventBusService
    paymentProviderService: PaymentProviderService
    fulfillmentProviderService: FulfillmentProviderService
    featureFlagRouter: FlagRouter
  
    regionRepository: typeof RegionRepository
    countryRepository: typeof CountryRepository
    currencyRepository: typeof CurrencyRepository
    taxProviderRepository: typeof TaxProviderRepository
    paymentProviderRepository: typeof PaymentProviderRepository
    fulfillmentProviderRepository: typeof FulfillmentProviderRepository
  };

@Service({override: MeudsaRegionService})
export class RegionService extends MeudsaRegionService {
    static resolutionKey = 'regionService';

    private readonly manager: EntityManager;
    private readonly regionRepository: typeof RegionRepository;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.regionRepository = container.regionRepository;
    }

    /**
   * Retrieves a region by its id.
   *
   * @param regionId - the id of the region to retrieve
   * @param config - configuration settings
   * @return the region
   */
  async retrieve(
    regionId: string,
    config: FindConfig<Region> = {}
  ): Promise<Region | never> {
    const regionRepository = this.manager_.getCustomRepository(
      this.regionRepository_
    )

    const query = buildQuery({ id: regionId }, config)
    const region = await regionRepository.findOne(query)

    if (!region) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Region with ${regionId} was not found`
      )
    }

    return region
  }

}