import { default as MedusaCustomerService } from "@medusajs/medusa/dist/services/customer";
//import {CustomerService as MedusaCustomerService} from "@medusajs/medusa/dist/services";
import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from 'typeorm';
import {CustomerRepository} from "../repositories/customer.repository";
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { Customer} from "../entities/customer.entity";
import { AddressRepository} from "@medusajs/medusa/dist/repositories/address";
import { CreateCustomerInput } from "../types/customer";
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import {buildQuery} from "@medusajs/medusa/dist/utils";
type InjectedDependencies = {
    manager: EntityManager;
    customerRepository: typeof CustomerRepository;
    eventBusService: EventBusService;
    addressRepository: typeof AddressRepository;
};

@Service({override: MedusaCustomerService})
//export default  class CustomerService extends MedusaCustomerService {
export class CustomerService extends MedusaCustomerService {
    static resolutionKey = 'customerService';

    private readonly manager: EntityManager;
    private readonly customerRepository: typeof CustomerRepository;
    private readonly eventBus: EventBusService;
    private readonly addressRepository: typeof AddressRepository;

    //constructor(private readonly container: InjectedDependencies) {
    constructor(container: InjectedDependencies) {
        super(container);
        this.manager = container.manager;
        this.customerRepository = container.customerRepository;
        this.eventBus = container.eventBusService;
       this.addressRepository = container.addressRepository;
    }
    
    async create(customer: CreateCustomerInput): Promise<Customer> {//
      return await this.atomicPhase_(async (manager) => {
        const customerRepository = manager.getCustomRepository(
          this.customerRepository
        )
  
        customer.email = customer.email.toLowerCase()
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
          const updated = await customerRepository.save(toUpdate)
          await this.eventBus
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
  
          const created = customerRepository.create(customer)
          const result = await customerRepository.save(created)
          await this.eventBusService_
            .withTransaction(manager)
            .emit(CustomerService.Events.CREATED, result)
          return result
        }
      })
    }
     /**
   * Gets a customer by email.
   * @param {string} email - the email of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieveByUsername(
    username: string,
    config: FindConfig<Customer> = {}
  ): Promise<Customer | never> {
    return await this.customRetrieve({ user_name: username.toLowerCase() }, config)
  }

    /**
   * Gets a customer by email.
   * @param {string} email - the email of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieveByEmail(
    email: string,
    config: FindConfig<Customer> = {}
  ): Promise<Customer | never> {
    return await this.customRetrieve({ email: email.toLowerCase() }, config)
  }

  /**
   * Gets a customer by phone.
   * @param {string} phone - the phone of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieveByPhone(
    phone: string,
    config: FindConfig<Customer> = {}
  ): Promise<Customer | never> {
    return await this.customRetrieve({ phone }, config)
  }
    async retrieve(
      customerId: string,
      config: FindConfig<Customer> = {}
    ): Promise<Customer> {
      return this.customRetrieve({ id: customerId }, config)
    }

    private async customRetrieve(
      selector: Selector<Customer>,
      config: FindConfig<Customer> = {}
    ): Promise<Customer | never> {
      const manager = this.transactionManager_ ?? this.manager_
  
      const customerRepo = manager.getCustomRepository(this.customerRepository)
  
      const query = buildQuery(selector, config)
      const customer = await customerRepo.findOne(query)
  
      if (!customer) {
        const selectorConstraints = Object.entries(selector)
          .map((key, value) => `${key}: ${value}`)
          .join(", ")
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          `Customer with ${selectorConstraints} was not found`
        )
      }
  
      return customer;
    }

}
