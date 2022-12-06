import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { ShippingOption } from "../entities/shippingOption.entity";
import { ShippingOptionRepository as MedusaShippingOptionRepo } from "@medusajs/medusa/dist/repositories/shipping-option";

@MedusaRepository({override: MedusaShippingOptionRepo})
@EntityRepository(ShippingOption)
export class ShippingOptionRepository extends Utils.repositoryMixin<ShippingOption, MedusaShippingOptionRepo>(MedusaShippingOptionRepo) {}