import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Address } from "../entities/address.entity";
import { AddressRepository as MedusaAddressRepo } from "@medusajs/medusa/dist/repositories/address";
@MedusaRepository({override: MedusaAddressRepo})
@EntityRepository(Address)
export class AddressRepository extends Utils.repositoryMixin<Address, MedusaAddressRepo>(MedusaAddressRepo)  {}