import { Repository as MedusaRepository } from "medusa-extender";
import { EntityRepository, Repository } from "typeorm";
import { DeliveryArea } from "../entities/deliveryArea.entity";

@MedusaRepository()
@EntityRepository(DeliveryArea)
export class DeliveryAreaRepository extends Repository<DeliveryArea> {}