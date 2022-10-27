import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { Cart } from "../entities/cart.entity";

@MedusaRepository()
@EntityRepository(Cart)
export class CartRepository extends Repository<Cart> {}