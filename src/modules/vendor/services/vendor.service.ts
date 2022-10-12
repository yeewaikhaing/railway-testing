
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { EventBusService, TransactionBaseService } from "@medusajs/medusa";
import { VendorRepository } from '../repositories/vendor.repository';
import { Vendor } from '../entities/vendor.entity';
//, FindVendorConfig
import { CreateVendorInput } from '../types/vendor';
import { FindConfig, Selector,QuerySelector } from "@medusajs/medusa/dist/types/common";
import { MedusaError } from "medusa-core-utils";
import { buildQuery } from "@medusajs/medusa/dist/utils";
//import { VendorPaymentRepository } from '../repositories/vendorPayment.repository';

type InjectedDependencies = {
    manager: EntityManager;
    vendorRepository: typeof VendorRepository;
    //vendorPaymentRepository: typeof VendorPaymentRepository;
    eventBusService: EventBusService;
};

@Service()
export class VendorService extends TransactionBaseService {
    static resolutionKey = 'vendorService';

    static Events = {
        UPDATED: "price_group.updated",
        CREATED: "price_group.created",
        DELETED: "price_group.deleted",
      }
    protected transactionManager_: EntityManager | undefined;
    protected readonly manager_: EntityManager;
    protected readonly vendorRepository_: typeof VendorRepository;
    protected readonly eventBusService_: EventBusService;
   
    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.manager_ = container.manager;
        this.eventBusService_ = container.eventBusService;
        this.vendorRepository_ = container.vendorRepository;
      
    }

   
     /**
   * Creates a vendor.
   * @param vendorObject - the vendor to create
   * @return resolves to the creation result.
   */
  async create(vendorObject: CreateVendorInput, user_id: string): Promise<Vendor> {
    return await this.atomicPhase_(async (manager) => {
      
      const vendorRepo = manager.getCustomRepository(this.vendorRepository_);
      
      vendorObject.user_id = user_id;

      const vendor = vendorRepo.create(vendorObject);
    
      const newVendor = await vendorRepo.save(vendor);

        await this.eventBusService_
          .withTransaction(manager)
          .emit(VendorService.Events.CREATED, {
            id: vendor.id,
          })
     return newVendor;
    
     
    })
  }

  /**
   * Gets a vendor by id.
   * Throws in case of DB Error and if product was not found.
   * @param vendor_id - id of the vendor to get.
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve(
    vendor_id: string,
    config: FindConfig<Vendor> = {}
  ): Promise<Vendor> {
    return await this.retrieve_({ id: vendor_id }, config)
  }

  /**
   * Gets a vendor by selector.
   * Throws in case of DB Error and if vendor was not found.
   * @param selector - selector object
   * @param config - object that defines what should be included in the
   *   query response
   * @return the result of the find one operation.
   */
   async retrieve_(
    selector: Selector<Vendor>,
    config: FindConfig<Vendor> = {}
  ): Promise<Vendor> {
    const manager = this.manager_
    const vendorRepo = manager.getCustomRepository(this.vendorRepository_)

    const { relations, ...query } = buildQuery(selector, config)

    const vendor = await vendorRepo.findOneWithRelations(
      relations as (keyof Vendor)[],
      query
    )
    

    if (!vendor) {
      const selectorConstraints = Object.entries(selector)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ")
      
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Vendor with ${selectorConstraints} was not found`
      )
    }

    return vendor
  }


}