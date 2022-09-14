import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { Vendor } from "../entities/vendor.entity";
@MedusaRepository()
@EntityRepository(Vendor)
export class VendorRepository extends Repository<Vendor> {}