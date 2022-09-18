import { BaseService } from "medusa-interfaces";
import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import {CustomerRepository} from "../repositories/customer.repository";
import EventBusService from '@medusajs/medusa/dist/services/event-bus';

type InjectedDependencies = {
    manager: EntityManager;
    customerRepository: typeof CustomerRepository;
    eventBusService: EventBusService;

};

@Service()
export class CustomerService extends BaseService {
    static resolutionKey = 'customerService';

    private readonly manager: EntityManager;
    private readonly customerRepository: typeof CustomerRepository;
    private readonly eventBus: EventBusService;

    constructor(private readonly container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.customerRepository = container.customerRepository;
        this.eventBus = container.eventBusService;
    }
}