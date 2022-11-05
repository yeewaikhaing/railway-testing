import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaFulfillmentService } from "@medusajs/medusa/dist/services/fulfillment";
import { TotalsService } from "../../cart/services/totals.service";
import { LineItemService } from "../../lineItem/services/lineItem.service";
import { FulfillmentRepository } from "../repositories/fulfillment.repository";
import { TrackingLinkRepository } from "@medusajs/medusa/dist/repositories/tracking-link";
import { LineItemRepository } from "../../lineItem/repositories/lineItem.repository";
import  FulfillmentProviderService  from "@medusajs/medusa/dist/services/fulfillment-provider";
import  ShippingProfileService from "@medusajs/medusa/dist/services/shipping-profile";


type InjectedDependencies = {
    manager: EntityManager
    totalsService: TotalsService
    shippingProfileService: ShippingProfileService
    lineItemService: LineItemService
    fulfillmentProviderService: FulfillmentProviderService
    fulfillmentRepository: typeof FulfillmentRepository
    trackingLinkRepository: typeof TrackingLinkRepository
    lineItemRepository: typeof LineItemRepository
  }
  
@Service({override: FulfillmentService})
export class FulfillmentService extends MedusaFulfillmentService {
    static resolutionKey = 'fulfillmentService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly fulfillmentRepository: typeof FulfillmentRepository;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
        this.fulfillmentRepository = container.fulfillmentRepository;
    }
}