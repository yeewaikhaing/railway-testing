import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { PaymentSessionRepository as MedusaPaymentSessionRepo } from "@medusajs/medusa/dist/repositories/payment-session";
import { PaymentSession } from "../entities/paymentSession.entity";

@MedusaRepository({override: MedusaPaymentSessionRepo})
@EntityRepository(PaymentSession)
export class PaymentSessionRepository extends Utils.repositoryMixin<PaymentSession, MedusaPaymentSessionRepo>(MedusaPaymentSessionRepo){}