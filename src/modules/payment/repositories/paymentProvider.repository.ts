import { PaymentProvider} from "@medusajs/medusa/dist/models/payment-provider";
import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { PaymentProviderRepository as MedusaPaymentProviderRepo } from "@medusajs/medusa/dist/repositories/payment-provider";

@MedusaRepository({override: MedusaPaymentProviderRepo})
@EntityRepository(PaymentProvider)
export class PaymentProviderRepository extends Utils.repositoryMixin<PaymentProvider, MedusaPaymentProviderRepo>(MedusaPaymentProviderRepo) {}