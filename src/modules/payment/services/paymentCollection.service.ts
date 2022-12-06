import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaPaymentCollectionService} from "@medusajs/medusa/dist/services/payment-collection";
import { PaymentCollectionRepository } from "../repositories/paymentCollection.repository";
import { PaymentProviderService } from "./paymentProvider.service";
import { EventBusService } from "@medusajs/medusa";
import { CustomerService } from "../../customer/v1/services/customer.service";


type InjectedDependencies = {
    manager: EntityManager
    paymentCollectionRepository: typeof PaymentCollectionRepository
    paymentProviderService: PaymentProviderService
    eventBusService: EventBusService
    customerService: CustomerService
  }

@Service({override: MedusaPaymentCollectionService})
export class PaymentCollectionService extends MedusaPaymentCollectionService {
    static resolutionKey = 'paymentCollectionService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;
    private readonly paymentCollectionRepo: typeof PaymentCollectionRepository;

    constructor(container: InjectedDependencies) {
        super(container);
        this.container = container
        this.manager = container.manager;
        this.paymentCollectionRepo = container.paymentCollectionRepository;
    }
}