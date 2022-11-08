import { Repository as MedusaRepository,Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { CustomShippingOption } from "../entities/customShippingOption.entity";
import { CustomShippingOptionRepository as MedusaCustomShippingOptionReo } from "@medusajs/medusa/dist/repositories/custom-shipping-option";

@MedusaRepository({override: MedusaCustomShippingOptionReo})
@EntityRepository(CustomShippingOption)
export class CustomShippingOptionRepository extends Utils.repositoryMixin<CustomShippingOption, MedusaCustomShippingOptionReo>(MedusaCustomShippingOptionReo){}