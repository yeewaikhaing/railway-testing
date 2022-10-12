import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { VendorPayment } from "../entities/vendorPayment.entity";

@MedusaRepository()
@EntityRepository(VendorPayment)
export class VendorPaymentRepository extends Repository<VendorPayment> {}