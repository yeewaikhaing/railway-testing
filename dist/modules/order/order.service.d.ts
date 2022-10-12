import { EntityManager } from 'typeorm';
import { OrderService as MedusaOrderService } from "@medusajs/medusa/dist/services";
import { OrderRepository } from './order.repository';
import { User } from "../user/entities/user.entity";
declare type InjectedDependencies = {
    manager: EntityManager;
    orderRepository: typeof OrderRepository;
    customerService: any;
    paymentProviderService: any;
    shippingOptionService: any;
    shippingProfileService: any;
    discountService: any;
    fulfillmentProviderService: any;
    fulfillmentService: any;
    lineItemService: any;
    totalsService: any;
    regionService: any;
    cartService: any;
    addressRepository: any;
    giftCardService: any;
    draftOrderService: any;
    inventoryService: any;
    eventBusService: any;
    loggedInUser?: User;
    orderService: OrderService;
};
export declare class OrderService extends MedusaOrderService {
    private readonly manager;
    private readonly container;
    constructor(container: InjectedDependencies);
    buildQuery_(selector: object, config: {
        relations: string[];
        select: string[];
    }): object;
}
export {};
