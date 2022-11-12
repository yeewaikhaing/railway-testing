import { Repository as MedusaRepository, Utils } from "medusa-extender";
import { EntityRepository } from "typeorm";
import { OrderEdit } from "../entities/orderEdit.entity";
import { OrderEditRepository as MedusaOrderEditRepo } from "@medusajs/medusa/dist/repositories/order-edit";

@MedusaRepository({override: MedusaOrderEditRepo})
@EntityRepository(OrderEdit)
export class OrderEditRepository extends Utils.repositoryMixin<OrderEdit, MedusaOrderEditRepo>(MedusaOrderEditRepo) {}