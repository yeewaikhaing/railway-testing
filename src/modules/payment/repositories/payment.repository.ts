import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { PaymentRepository as MedusaPaymentRepo } from "@medusajs/medusa/dist/repositories/payment";
import { Payment } from "../entities/payment.entity";

@MedusaRepository({override: MedusaPaymentRepo})
@EntityRepository(Payment)
export class PaymentRepository extends Utils.repositoryMixin<Payment, MedusaPaymentRepo>(MedusaPaymentRepo){}