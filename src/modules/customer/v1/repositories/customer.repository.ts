import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { Customer } from "../entities/customer.entity";
import { CustomerRepository as MedusaCustomerRepo } from "@medusajs/medusa/dist/repositories/customer";
@MedusaRepository({override: MedusaCustomerRepo})
@EntityRepository(Customer)
export  class CustomerRepository extends Utils.repositoryMixin<Customer, MedusaCustomerRepo>(MedusaCustomerRepo)  {}