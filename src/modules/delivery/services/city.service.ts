import { Service } from 'medusa-extender';
import { EntityManager,IsNull } from 'typeorm';
import { EventBusService, TransactionBaseService } from "@medusajs/medusa";
import { CreateCityInput } from '../types/city';
import { City } from '../entities/city.entity';
import { CityRepository } from '../repositories/city.repository';
import { FindConfig, Selector,QuerySelector } from "@medusajs/medusa/dist/types/common";
import { MedusaError } from "medusa-core-utils";
import { buildQuery } from "@medusajs/medusa/dist/utils";

type InjectedDependencies = {
    manager: EntityManager;
    cityRepository: typeof CityRepository;
    eventBusService: EventBusService;
};

@Service()
export class CityService extends TransactionBaseService {
    static resolutionKey = 'cityService';

    static Events = {
        UPDATED: "city.updated",
        CREATED: "city.created",
        DELETED: "city.deleted",
      }
    protected transactionManager_: EntityManager | undefined;
    protected readonly manager_: EntityManager;
    protected readonly cityRepository_: typeof CityRepository;
    protected readonly eventBusService_: EventBusService;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.manager_ = container.manager;
        this.cityRepository_ = container.cityRepository;
        this.eventBusService_ = container.eventBusService;
    }

   
    /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
    async list( selector: QuerySelector<City>, config:FindConfig<City> = {}): Promise<City[]> {
     const manager = this.manager_
     const cityRepo = manager.getCustomRepository(this.cityRepository_)
    
      const city_id = selector.id;
     if(city_id) {
        return await cityRepo.createQueryBuilder("city")
        .innerJoinAndSelect("city.areas", "area")
        .where("city.id = :id", {id: city_id})
        .andWhere("area.pricing_id is null")
        .getMany();
     }

    // all cities and its related unpricing area
    return await cityRepo.createQueryBuilder("city")
    .innerJoinAndSelect("city.areas", "area")
    .where("area.pricing_id is null")
    .getMany();
  }

    /**
     * Creates a city and its related areas.
     * @param cityObject - the city to create
     * @return resolves to the creation result.
     */
    async create(cityObject: CreateCityInput): Promise<City> {
        return await this.atomicPhase_(async (manager) => {
        
        const cityRepo = manager.getCustomRepository(this.cityRepository_);
        
        const city = cityRepo.create(cityObject);
        //console.log("before save, city = ", city);
        
        
        const newCity = await cityRepo.save(city);
        //console.log("after save, city = ", newCity);
        
        await this.eventBusService_
        .withTransaction(manager)
        .emit(CityService.Events.CREATED, {
            id: newCity.id,
        })
        return newCity;
        
    })
  }

  /**
   * Gets a city by id.
   * Throws in case of DB Error and if city was not found.
   * @param city_id - id of the city to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve(
    city_id: string,
    config: FindConfig<City> = {}
  ): Promise<City> {
    return await this.retrieve_({ id: city_id }, config)
  }

  /**
   * Gets a city by selector.
   * Throws in case of DB Error and if city was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve_(
    selector: Selector<City>,
    config: FindConfig<City> = {}
  ): Promise<City> {
    const manager = this.manager_
    const cityRepo = manager.getCustomRepository(this.cityRepository_)

    const { relations, ...query } = buildQuery(selector, config)

    const city = await cityRepo.findOneWithRelations(
      relations as (keyof City)[],
      query
    )
    

    if (!city) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
      
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `City with ${selectorConstraints} was not found`
      )
    }

    return city;
  }


}