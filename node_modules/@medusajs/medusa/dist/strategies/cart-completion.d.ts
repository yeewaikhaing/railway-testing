import { EntityManager } from "typeorm";
import { IdempotencyKey } from "../models";
import CartService from "../services/cart";
import IdempotencyKeyService from "../services/idempotency-key";
import OrderService from "../services/order";
import SwapService from "../services/swap";
import { RequestContext } from "../types/request";
import { AbstractCartCompletionStrategy, CartCompletionResponse } from "../interfaces";
declare type InjectedDependencies = {
    idempotencyKeyService: IdempotencyKeyService;
    cartService: CartService;
    orderService: OrderService;
    swapService: SwapService;
    manager: EntityManager;
};
declare class CartCompletionStrategy extends AbstractCartCompletionStrategy {
    protected manager_: EntityManager;
    protected readonly idempotencyKeyService_: IdempotencyKeyService;
    protected readonly cartService_: CartService;
    protected readonly orderService_: OrderService;
    protected readonly swapService_: SwapService;
    constructor({ idempotencyKeyService, cartService, orderService, swapService, manager, }: InjectedDependencies);
    complete(id: string, ikey: IdempotencyKey, context: RequestContext): Promise<CartCompletionResponse>;
}
export default CartCompletionStrategy;
