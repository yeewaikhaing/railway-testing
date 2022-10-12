import { OrderRepository as MedusaOrderRepository } from "@medusajs/medusa/dist/repositories/order";
import { Order } from "./order.entity";
declare const OrderRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<Order>, MedusaOrderRepository>;
export declare class OrderRepository extends OrderRepository_base {
}
export {};
