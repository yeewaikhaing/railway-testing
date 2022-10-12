import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { City } from "../entities/city.entity";

@MedusaRepository()
@EntityRepository(City)
export class CityRepository extends Repository<City> {}