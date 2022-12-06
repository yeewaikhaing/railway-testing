import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { PaymentCollectionRepository as MedusaPaymentCollectionRepo } from "@medusajs/medusa/dist/repositories/payment-collection";
import { PaymentCollection } from "../entities/paymentCollection.entity";

@MedusaRepository({override: MedusaPaymentCollectionRepo})
@EntityRepository(PaymentCollection)
export class PaymentCollectionRepository extends Utils.repositoryMixin<PaymentCollection, MedusaPaymentCollectionRepo>(MedusaPaymentCollectionRepo) {}