import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { TransactionBaseService } from "@medusajs/medusa/dist/interfaces";
import { PriceGroupRepository } from './priceGroup.repository';
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { FindConfig, Selector,QuerySelector } from "@medusajs/medusa/dist/types/common";
import { PriceGroup } from "./priceGroup.entity";
import { MedusaError } from "medusa-core-utils";
import { buildQuery } from "@medusajs/medusa/dist/utils";
import { CreatePriceGroupInput,UpdatePriceGroupInput } from "./types/price-group";
type InjectedDependencies = {
    manager: EntityManager;
    priceGroupRepository: typeof PriceGroupRepository;
    eventBusService: EventBusService;
};

@Service()
export class PriceGroupService extends TransactionBaseService{
 //class PriceGroupService extends TransactionBaseService{
 // export class PriceGroupService extends TransactionBaseService{
    static resolutionKey = 'priceGroupService';
    static Events = {
        UPDATED: "price_group.updated",
        CREATED: "price_group.created",
        DELETED: "price_group.deleted",
      }
    protected transactionManager_: EntityManager | undefined;
    protected readonly manager_: EntityManager;
    protected readonly priceGroupRepository_: typeof PriceGroupRepository;
    protected readonly eventBusService_: EventBusService;
    constructor({manager,priceGroupRepository, eventBusService}: InjectedDependencies) {
    //  constructor(container: InjectedDependencies) {
        super({manager,priceGroupRepository, eventBusService}); // 
        //onsole.log("This is price group service");
        this.manager_ = manager;
        this.eventBusService_ = eventBusService;
        this.priceGroupRepository_ = priceGroupRepository;
    }

    /**
   * A generic retrieve used to find a pricing group by different attributes.
   *
   * @param selector - PriceGroup selector
   * @param config - find config
   * @returns a single PriceGroup matching the query or throws
   */
  protected async retrieve_(
    selector: Selector<PriceGroup>,
    config: FindConfig<PriceGroup> = {}
  ): Promise<PriceGroup> {
    const manager = this.manager_

    const priceGroupRepo = manager.getCustomRepository(this.priceGroupRepository_);

    const { relations, ...query } = buildQuery(selector, config)

    const priceGroup = await priceGroupRepo.findOneWithRelations(
      relations as (keyof PriceGroup)[],
      query
    )
      console.log("price gorup in service: ", priceGroup);
    if (!priceGroup) {
      const selectorConstraints = Object.entries(selector)
        .map((key, value) => `${key}: ${value}`)
        .join(", ")

      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Price group with ${selectorConstraints} was not found`
      )
    }

    return priceGroup
  }
  
  /**
   * Retrieve a PriceGroup by id
   *
   * @param priceGroupId - id of the PriceGroup to retrieve
   * @param config - PriceGroup config
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns a PriceGroup
   */
   async retrieve(
    priceGroupId: string,
    config: FindConfig<PriceGroup> = {}
  ): Promise<PriceGroup | never> {
    return await this.retrieve_({ id: priceGroupId }, config)
  }

  /**
   * Find a priceGroup by name.
   *
   * @param name of priceGroup
   * @param config - find config
   * @return a priceGroup with matching name
   */
   async retrieveByName(
    name: string,
    config: FindConfig<PriceGroup> = {}
  ): Promise<PriceGroup | unknown> {
    return await this.retrieve_({ name }, config)
  }

  /**
   * Lists PriceGroup based on the provided parameters and includes the count of
   * PriceGroup that match the query.
   * @return an array containing the PriceGroup as
   *   the first element and the total count of PriceGroup that matches the query
   *   as the second element.
   */
   async listAndCount(
    selector: QuerySelector<PriceGroup>,
    config: FindConfig<PriceGroup> = {
      skip: 0,
      take: 20,
    }
  ): Promise<[PriceGroup[], number]> {
    const manager = this.manager_
    const priceChannelRepo = manager.getCustomRepository(this.priceGroupRepository_)

    const selector_ = { ...selector }
    let q: string | undefined
    if ("q" in selector_) {
      q = selector_.q
      delete selector_.q
    }

    const query = buildQuery(selector_, config)

    if (q) {
      return await priceChannelRepo.getFreeTextSearchResultsAndCount(q, query)
    }

    return await priceChannelRepo.findAndCount(query)
  }

  /**
   * Creates a priceGroup
   *
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @returns the created priceGroup
   */
   async create(data: CreatePriceGroupInput): Promise<PriceGroup | never> {
    return await this.atomicPhase_(async (manager) => {
      const priceGroupRepo: PriceGroupRepository = manager.getCustomRepository(this.priceGroupRepository_);
      
      // check pricing group name already exists
      const existing = await this.retrieveByName(data.name).catch(() => undefined);
      if(existing) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A priceing group with the given name already exist."
        );
      }
      const priceGroup = priceGroupRepo.create(data)

      await this.eventBusService_
        .withTransaction(manager)
        .emit(PriceGroupService.Events.CREATED, {
          id: priceGroup.id,
        })

      return await priceGroupRepo.save(priceGroup)
    })
  }
  async update(
    priceGrouplId: string,
    data: UpdatePriceGroupInput
  ): Promise<PriceGroup | never> {
    return await this.atomicPhase_(async (transactionManager) => {
      const priceGroupRepo: PriceGroupRepository = transactionManager.getCustomRepository(this.priceGroupRepository_);

      const priceGroup = await this.retrieve(priceGrouplId)

      for (const key of Object.keys(data)) {
        if (typeof data[key] !== `undefined`) {
            priceGroup[key] = data[key]
        }
      }

      const result = await priceGroupRepo.save(priceGroup)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(PriceGroupService.Events.UPDATED, {
          id: result.id,
        })

      return result
    })
  }

  /**
   * Deletes a priceGroup from
   * @experimental This feature is under development and may change in the future.
   * To use this feature please enable the corresponding feature flag in your medusa backend project.
   * @param priceGroupId - the id of the priceGroup to delete
   */
   async delete(priceGroupId: string): Promise<void> {
    return await this.atomicPhase_(async (transactionManager) => {
      const priceGroupRepo = transactionManager.getCustomRepository(
        this.priceGroupRepository_
      );

      const priceGroup = await this.retrieve(priceGroupId).catch(
        () => void 0
      )

      if (!priceGroup) {
        return
      }

    //   const store = await this.storeService_.retrieve({
    //     select: ["default_sales_channel_id"],
    //   })

    //   if (salesChannel.id === store?.default_sales_channel_id) {
    //     throw new MedusaError(
    //       MedusaError.Types.NOT_ALLOWED,
    //       "You cannot delete the default sales channel"
    //     )
    //   }

      await priceGroupRepo.softRemove(priceGroup)

      await this.eventBusService_
        .withTransaction(transactionManager)
        .emit(PriceGroupService.Events.DELETED, {
          id: priceGroupId,
        })
    })
  }
}
//export default PriceGroupService