import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository} from "typeorm";
import { ShippingMethod } from "../entities/shippingMethod.entity";
import { ShippingMethodRepository as MedusaShippingMethodRepo } from "@medusajs/medusa/dist/repositories/shipping-method";

@MedusaRepository({override: MedusaShippingMethodRepo})
@EntityRepository(ShippingMethod)
export class ShippingMethodRepository extends Utils.repositoryMixin<ShippingMethod, MedusaShippingMethodRepo>(MedusaShippingMethodRepo){}