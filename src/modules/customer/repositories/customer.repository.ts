import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";

@MedusaRepository()
@EntityRepository(/* Specify your entity */)
export class CustomerRepository extends Repository</* Specify your entity */> {}