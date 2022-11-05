import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Fulfillment } from "../entities/fulfillment.entity";
import { FulfillmentRepository as MedusaFulfillmentRepo } from "@medusajs/medusa/dist/repositories/fulfillment";

@MedusaRepository({override: MedusaFulfillmentRepo})
@EntityRepository(Fulfillment)
export class FulfillmentRepository extends Utils.repositoryMixin<Fulfillment, MedusaFulfillmentRepo>(MedusaFulfillmentRepo) {}