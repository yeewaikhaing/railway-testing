import { Repository as MedusaRepository,Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Fulfillment } from "../entities/fulfillment.entity";
import { FulfillmentProviderRepository as MedusaFullfillmentProviderRepo } from "@medusajs/medusa/dist/repositories/fulfillment-provider";
import { FulfillmentProvider } from "../entities/fulfillmentProvider.entity";

@MedusaRepository({override: MedusaFullfillmentProviderRepo})
@EntityRepository(FulfillmentProvider)
export class FulfillmentProviderRepository extends Utils.repositoryMixin<FulfillmentProvider, MedusaFullfillmentProviderRepo>(MedusaFullfillmentProviderRepo) {}