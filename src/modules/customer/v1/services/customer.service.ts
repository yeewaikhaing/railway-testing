import { default as MedusaCustomerService } from "@medusajs/medusa/dist/services/customer";
import jwt from "jsonwebtoken";
import { Service } from 'medusa-extender';
import { MedusaError } from "medusa-core-utils"
import { EntityManager } from 'typeorm';
import {CustomerRepository} from "../repositories/customer.repository";
import EventBusService from '@medusajs/medusa/dist/services/event-bus';
import { Customer} from "../entities/customer.entity";
import { AddressRepository} from "../repositories/address.repository";
import { CreateCustomerInput } from "../types/customer";
import { AddressCreatePayload } from '../types/address';
import { FindConfig, Selector } from "@medusajs/medusa/dist/types/common";
import {buildQuery} from "@medusajs/medusa/dist/utils";
import { Address } from "../entities/address.entity";

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
  
    async updateMyAddress(
      customerId: string,
      addressId: string,
      address: AddressCreatePayload
    ): Promise<Address> {
      return await this.atomicPhase_(async (manager) => {
        const addressRepo = manager.getCustomRepository(this.addressRepository)
  
       // address.country_code = address.country_code?.toLowerCase()
  
        const toUpdate = await addressRepo.findOne({
          where: { id: addressId, customer_id: customerId },
        })
  
        if (!toUpdate) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "Could not find address for customer"
          )
        }
        for (const [key, value] of Object.entries(address)) {
          toUpdate[key] = value
        }
  
        return addressRepo.save(toUpdate)
      })
    }
  
    async removeAddress(customerId: string, addressId: string): Promise<void> {
      return await this.atomicPhase_(async (manager) => {
        const addressRepo = manager.getCustomRepository(this.addressRepository)
  
        // Should not fail, if user does not exist, since delete is idempotent
        const address = await addressRepo.findOne({
          where: { id: addressId, customer_id: customerId },
        })
  
        if (!address) {
          return
        }
  
        await addressRepo.softRemove(address)
      })
    }
  
    async addAddress(
      customerId: string,
      address: AddressCreatePayload
    ): Promise<Customer | Address> {
      return await this.atomicPhase_(async (manager) => {
        const addressRepository = manager.getCustomRepository(
          this.addressRepository
        )
  
        //address.country_code = address.country_code.toLowerCase()
  
        // const customer = await this.retrieve(customerId, {
        //   relations: ["shipping_addresses"],
        // })
        const customer = await this.retrieve(customerId, {
          relations: ["addresses"],
        })
  
        // const shouldAdd = !customer.shipping_addresses.find(
        //   (a) =>
        //     a.country_code?.toLowerCase() ===
        //       address.country_code.toLowerCase() &&
        //     a.address_1 === address.address_1 &&
        //     a.address_2 === address.address_2 &&
        //     a.city === address.city &&
        //     a.phone === address.phone &&
        //     a.postal_code === address.postal_code &&
        //     a.province === address.province &&
        //     a.first_name === address.first_name &&
        //     a.last_name === address.last_name
        // )

        const shouldAdd = !customer.addresses.find(
          (a) =>
            a.address_1 === address.address_1 &&
            a.address_2 === address.address_2 &&
            a.city === address.city &&
            a.phone === address.phone &&
            a.postal_code === address.postal_code &&
            a.province === address.province &&
            a.first_name === address.first_name &&
            a.last_name === address.last_name
        )
  
        if (shouldAdd) {
          const created = addressRepository.create({
            ...address,
            customer_id: customerId,
          })
          const result = await addressRepository.save(created)
          return result
        } else {
          return customer
        }
      })
    }
  
    /**
   * Generate a JSON Web token, that will be sent to a customer, that wishes to
   * reset password.
   * The token will be signed with the customer's current password hash as a
   * secret a long side a payload with userId and the expiry time for the token,
   * which is always 15 minutes.
   * @param {string} customerId - the customer to reset the password for
   * @return {string} the generated JSON web token
   */
  async generateResetPasswordToken(customerId: string): Promise<string> {
    return await this.atomicPhase_(async (manager) => {
      const customer = await this.retrieve(customerId, {
        select: [
          "id",
          "has_account",
          "password_hash",
          "email",
          "first_name",
          "last_name",
        ],
      })

      if (!customer.has_account) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "You must have an account to reset the password. Create an account first"
        )
      }

      const secret = customer.password_hash
      const expiry = Math.floor(Date.now() / 1000) + 60 * 15 // 15 minutes ahead
      const payload = { customer_id: customer.id, exp: expiry }
      const token = jwt.sign(payload, secret)
      // Notify subscribers
      this.eventBusService_
        .withTransaction(manager)
        .emit(CustomerService.Events.PASSWORD_RESET, {
          id: customerId,
          email: customer.email,
          first_name: customer.first_name,
          last_name: customer.last_name,
          token,
        })
      return token
    })
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
