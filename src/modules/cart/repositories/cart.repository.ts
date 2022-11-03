import { Repository as MedusaRepository, Utils} from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Cart } from "../entities/cart.entity";
import { CartRepository as MedusaCartRepo } from "@medusajs/medusa/dist/repositories/cart";

@MedusaRepository({override: MedusaCartRepo})
@EntityRepository(Cart)
export class CartRepository extends Utils.repositoryMixin<Cart, MedusaCartRepo>(MedusaCartRepo)  {}