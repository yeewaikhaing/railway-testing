import { EventBusService, OrderService } from "@medusajs/medusa/dist/services";
import { EntityManager } from "typeorm";
import { LineItemRepository } from '@medusajs/medusa/dist/repositories/line-item';
import { Order } from './order.entity';
import { OrderRepository } from "./order.repository";
import { PaymentRepository } from "@medusajs/medusa/dist/repositories/payment";
import { ProductService } from './../product/services/product.service';
import { ShippingMethodRepository } from "@medusajs/medusa/dist/repositories/shipping-method";
declare type InjectedDependencies = {
    eventBusService: EventBusService;
    orderService: OrderService;
    orderRepository: typeof OrderRepository;
    productService: ProductService;
    manager: EntityManager;
    lineItemRepository: typeof LineItemRepository;
    shippingMethodRepository: typeof ShippingMethodRepository;
    paymentRepository: typeof PaymentRepository;
};
export declare class OrderSubscriber {
    private readonly manager;
    private readonly eventBusService;
    private readonly orderService;
    private readonly orderRepository;
    private readonly productService;
    private readonly lineItemRepository;
    private readonly shippingMethodRepository;
    constructor({ eventBusService, orderService, orderRepository, productService, manager, lineItemRepository, shippingMethodRepository, paymentRepository }: InjectedDependencies);
    checkStatus({ id }: {
        id: string;
    }): Promise<void>;
    getStatusFromChildren(order: Order): string;
    private handleOrderPlaced;
}
export {};
