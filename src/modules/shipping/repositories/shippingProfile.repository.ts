import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { ShippingProfile } from "../entities/shippingProfile.entity";
import { ShippingProfileRepository as MedusaShippingProfileRepo } from "@medusajs/medusa/dist/repositories/shipping-profile";

@MedusaRepository({override: MedusaShippingProfileRepo})
@EntityRepository(ShippingProfile)
export class ShippingProfileRepository extends  Utils.repositoryMixin<ShippingProfile, MedusaShippingProfileRepo>(MedusaShippingProfileRepo) {}