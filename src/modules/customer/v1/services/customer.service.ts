import { default as MedusaCustomerService } from "@medusajs/medusa/dist/services/customer";
//import {CustomerService as MedusaCustomerService} from "@medusajs/medusa/dist/services";
import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from 'typeorm';
import {CustomerRepository} from "../repositories/customer.repository";
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { Customer } from "@medusajs/medusa";
//import { CreateCustomerInput } from "@medusajs/medusa/dist/types/customers";
//import { AddressRepository} from "@medusajs/medusa/dist/repositories/address";
import { CreateCustomerInput } from "../types/customer";
type InjectedDependencies = {
    manager: EntityManager;
    customerRepository: typeof CustomerRepository;
    eventBusService: EventBusService;
   // addressRepository: typeof AddressRepository;
   addressRepository: any;
};

@Service({override: MedusaCustomerService})
//export default  class CustomerService extends MedusaCustomerService {
export   class CustomerService extends MedusaCustomerService {
    static resolutionKey = 'customerService';

    private readonly manager: EntityManager;
    private readonly customerRepository: typeof CustomerRepository;
    private readonly eventBus: EventBusService;
   // private readonly addressRepository: any;

    //constructor(private readonly container: InjectedDependencies) {
    constructor(container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.customerRepository = container.customerRepository;
        this.eventBus = container.eventBusService;
       // this.addressRepository = container.addressRepository;
    }

    async create(customer: CreateCustomerInput): Promise<Customer> {
        
        return await this.atomicPhase_(async (manager) => {
            const customerRepo = manager.getCustomRepository(this.customerRepository);
            console.log("------customer email", customer);
            customer.email = customer.email.toLowerCase();
            const { email, password } = customer

      const existing = await this.retrieveByEmail(email).catch(() => undefined)

      if (existing && existing.has_account) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A customer with the given email already has an account. Log in instead"
        )
      }
      if (existing && password && !existing.has_account) {
        const hashedPassword = await this.hashPassword_(password)
        customer.password_hash = hashedPassword
        customer.has_account = true
        delete customer.password

        const toUpdate = { ...existing, ...customer }
        const updated = await customerRepo.save(toUpdate)
        await this.eventBusService_
          .withTransaction(manager)
          .emit(CustomerService.Events.UPDATED, updated)
        return updated
      } else {
        if (password) {
          const hashedPassword = await this.hashPassword_(password)
          customer.password_hash = hashedPassword
          customer.has_account = true
          delete customer.password
        }

        const created = customerRepo.create(customer)
        const result = await customerRepo.save(created)
        await this.eventBusService_
          .withTransaction(manager)
          .emit(CustomerService.Events.CREATED, result)
        return result;
    }
})
}
}