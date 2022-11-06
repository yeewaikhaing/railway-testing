import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Refund } from "../entities/refund.entity";
import { RefundRepository as MedusaRefundRepo } from "@medusajs/medusa/dist/repositories/refund";

@MedusaRepository({override: MedusaRefundRepo})
@EntityRepository(Refund)
export class RefundRepository extends Utils.repositoryMixin<Refund, MedusaRefundRepo>(MedusaRefundRepo) {}