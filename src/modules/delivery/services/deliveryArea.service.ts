
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { EventBusService, TransactionBaseService } from "@medusajs/medusa";
import { DeliveryAreaRepository } from '../repositories/deliveryArea.repository';
      
type InjectedDependencies = {
    manager: EntityManager;
    deliveryAreaRepository: typeof DeliveryAreaRepository;
    eventBusService: EventBusService;
};

@Service()
export class DeliveryAreaService extends TransactionBaseService {
    static resolutionKey = 'deliveryAreaService';

    static Events = {
        UPDATED: "delivery_area.updated",
        CREATED: "delivery_area.created",
        DELETED: "delivery_area.deleted",
      }

    protected transactionManager_: EntityManager | undefined;
    protected readonly manager_: EntityManager;
    protected readonly deliveryAreaRepository_: typeof DeliveryAreaRepository;
    protected readonly eventBusService_: EventBusService;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.manager_ = container.manager;
        this.deliveryAreaRepository_ = container.deliveryAreaRepository;
        this.eventBusService_ = container.eventBusService;
    }

    /**
   * Gets a number of rows.
   * Throws in case of DB Error and if user was not found.
   * @param {string} areas - the array of area id.
   * @return {Promise<Number>} the number of rows .
   */
  async countById(areas: string[]): Promise<Number> {
    const manager = this.manager_
    const deliveryAreaRepo = manager.getCustomRepository(this.deliveryAreaRepository_);
    
    
    return await deliveryAreaRepo.createQueryBuilder()
                      .select()
                      .where("pricing_id is null AND id IN (:...ids)", {ids: areas})
                      .getCount();
  // // return await (await deliveryAreaRepo.findByIds(areas)).length
    
  }

  async updatePricing(
    priceGrouplId: string,
    area_ids: string[]
  ): Promise<void> {
     await this.atomicPhase_(async (transactionManager) => {
      const deliveryAreaRepo: DeliveryAreaRepository = transactionManager.getCustomRepository(this.deliveryAreaRepository_);

      if(priceGrouplId) {
        deliveryAreaRepo.createQueryBuilder()
                        .update()
                        .set({pricing_id: priceGrouplId})
                        .where("id IN (:...ids)", {ids: area_ids})
                        .execute();
      }
      else{ // delete price id
        deliveryAreaRepo.createQueryBuilder()
                        .update()
                        .set({pricing_id: null})
                        .where("id IN (:...ids)", {ids: area_ids})
                        .execute();
      }
     
      
    })
  }

}