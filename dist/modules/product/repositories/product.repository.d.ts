import { ProductRepository as MedusaProductRepository } from "@medusajs/medusa/dist/repositories/product";
import { Product } from '../entities/product.entity';
declare const ProductRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<Product>, MedusaProductRepository>;
export default class ProductRepository extends ProductRepository_base {
}
export {};
