import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Discount } from "../entities/discount.entity";
import { DiscountRepository as MedusaDiscountRepo } from "@medusajs/medusa/dist/repositories/discount";

@MedusaRepository({override: MedusaDiscountRepo})
@EntityRepository(Discount)
export class DiscountRepository extends Utils.repositoryMixin<Discount, MedusaDiscountRepo>(MedusaDiscountRepo)  {}