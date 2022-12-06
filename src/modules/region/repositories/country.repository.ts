import { Repository as MedusaRepository, Utils} from "medusa-extender";
import { EntityRepository } from "typeorm";
import { Country } from "../entities/country.entity";
import { CountryRepository as MedusaCountryRepo } from "@medusajs/medusa/dist/repositories/country";

@MedusaRepository({override: MedusaCountryRepo})
@EntityRepository(Country)
export class CountryRepository extends Utils.repositoryMixin<Country, MedusaCountryRepo>(MedusaCountryRepo) {}