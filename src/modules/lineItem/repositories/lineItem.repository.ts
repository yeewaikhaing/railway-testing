import { Repository as MedusaRepository,Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { LineItem } from "../entities/lineItem.entity";
import { LineItemRepository as MedusaLineItemRepo } from "@medusajs/medusa/dist/repositories/line-item";

@MedusaRepository({override: MedusaLineItemRepo})
@EntityRepository(LineItem)
export class LineItemRepository extends Utils.repositoryMixin<LineItem, MedusaLineItemRepo>(MedusaLineItemRepo)   {}