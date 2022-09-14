import { Order as MedusaOrder } from "@medusajs/medusa";
import { Store } from "../store/entities/store.entity";
export declare class Order extends MedusaOrder {
    store_id: string;
    order_parent_id: string;
    store: Store;
    parent: Order;
    children: Order[];
}
