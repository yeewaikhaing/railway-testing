import { Repository as MedusaRepository ,Utils} from "medusa-extender";
import { EntityRepository } from "typeorm";
import { LineItemTaxLineRepository as MedusaLineItemTaxLineRepo } from "@medusajs/medusa/dist/repositories/line-item-tax-line";
import { LineItemTaxLine } from "../entities/lineItemTaxLine.entity";

@MedusaRepository({override: MedusaLineItemTaxLineRepo})
@EntityRepository(LineItemTaxLine)
export class LineItemTaxLineRepository extends  Utils.repositoryMixin<LineItemTaxLine, MedusaLineItemTaxLineRepo>(MedusaLineItemTaxLineRepo)   {}