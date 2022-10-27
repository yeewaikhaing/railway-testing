import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { Discount } from "../entities/discount.entity";

@MedusaRepository()
@EntityRepository(Discount)
export class DiscountRepository extends Repository<Discount> {}