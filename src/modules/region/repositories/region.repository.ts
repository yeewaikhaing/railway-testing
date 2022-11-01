import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Region } from "../entities/region.entity";
import { RegionRepository as MedusaRegionRepo } from "@medusajs/medusa/dist/repositories/region";
@MedusaRepository({override: MedusaRegionRepo})
@EntityRepository(Region)
export class RegionRepository extends Utils.repositoryMixin<Region, MedusaRegionRepo>(MedusaRegionRepo) {}