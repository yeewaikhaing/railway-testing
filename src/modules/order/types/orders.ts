import { Order } from "../entities/order.entity";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isOrder(object: any): object is Order {
    return object.object === "order"
  }
  