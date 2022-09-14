"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderSubscriber = void 0;
const services_1 = require("@medusajs/medusa/dist/services");
const medusa_1 = require("@medusajs/medusa");
const medusa_extender_1 = require("medusa-extender");
let OrderSubscriber = class OrderSubscriber {
    constructor({ eventBusService, orderService, orderRepository, productService, manager, lineItemRepository, shippingMethodRepository, paymentRepository }) {
        this.eventBusService = eventBusService;
        this.orderService = orderService;
        this.orderRepository = orderRepository;
        this.productService = productService;
        this.manager = manager;
        this.lineItemRepository = lineItemRepository;
        this.shippingMethodRepository = shippingMethodRepository;
        this.eventBusService.subscribe(services_1.OrderService.Events.PLACED, this.handleOrderPlaced.bind(this));
        //add handler for different status changes
        this.eventBusService.subscribe(services_1.OrderService.Events.CANCELED, this.checkStatus.bind(this));
        this.eventBusService.subscribe(services_1.OrderService.Events.UPDATED, this.checkStatus.bind(this));
        this.eventBusService.subscribe(services_1.OrderService.Events.COMPLETED, this.checkStatus.bind(this));
    }
    async checkStatus({ id }) {
        //retrieve order
        const order = await this.orderService.retrieve(id);
        if (order.order_parent_id) {
            //retrieve parent
            const orderRepo = this.manager.getCustomRepository(this.orderRepository);
            const parentOrder = await this.orderService.retrieve(order.order_parent_id, {
                relations: ['children']
            });
            const newStatus = this.getStatusFromChildren(parentOrder);
            if (newStatus !== parentOrder.status) {
                switch (newStatus) {
                    case medusa_1.OrderStatus.CANCELED:
                        this.orderService.cancel(parentOrder.id);
                        break;
                    case medusa_1.OrderStatus.ARCHIVED:
                        this.orderService.archive(parentOrder.id);
                        break;
                    case medusa_1.OrderStatus.COMPLETED:
                        this.orderService.completeOrder(parentOrder.id);
                        break;
                    default:
                        parentOrder.status = newStatus;
                        parentOrder.fulfillment_status = newStatus;
                        parentOrder.payment_status = newStatus;
                        await orderRepo.save(parentOrder);
                }
            }
        }
    }
    getStatusFromChildren(order) {
        if (!order.children) {
            return order.status;
        }
        //collect all statuses
        let statuses = order.children.map((child) => child.status);
        //remove duplicate statuses
        statuses = [...new Set(statuses)];
        if (statuses.length === 1) {
            return statuses[0];
        }
        //remove archived and canceled orders
        statuses = statuses.filter((status) => status !== medusa_1.OrderStatus.CANCELED && status !== medusa_1.OrderStatus.ARCHIVED);
        if (!statuses.length) {
            //all child orders are archived or canceled
            return medusa_1.OrderStatus.CANCELED;
        }
        if (statuses.length === 1) {
            return statuses[0];
        }
        //check if any order requires action
        const hasRequiresAction = statuses.some((status) => status === medusa_1.OrderStatus.REQUIRES_ACTION);
        if (hasRequiresAction) {
            return medusa_1.OrderStatus.REQUIRES_ACTION;
        }
        //since more than one status is left and we filtered out canceled, archived,
        //and requires action statuses, only pending and complete left. So, return pending
        return medusa_1.OrderStatus.PENDING;
    }
    async handleOrderPlaced({ id }) {
        //create child orders
        //retrieve order
        const order = await this.orderService.retrieve(id, {
            relations: ['items', 'items.variant', 'cart', 'shipping_methods', 'payments']
        });
        //group items by store id
        const groupedItems = {};
        for (const item of order.items) {
            const product = await this.productService.retrieve(item.variant.product_id, { select: ['store_id'] });
            const store_id = product.store_id;
            if (!store_id) {
                continue;
            }
            if (!groupedItems.hasOwnProperty(store_id)) {
                groupedItems[store_id] = [];
            }
            groupedItems[store_id].push(item);
        }
        const orderRepo = this.manager.getCustomRepository(this.orderRepository);
        const lineItemRepo = this.manager.getCustomRepository(this.lineItemRepository);
        const shippingMethodRepo = this.manager.getCustomRepository(this.shippingMethodRepository);
        for (const store_id in groupedItems) {
            //create order
            const childOrder = orderRepo.create(Object.assign(Object.assign({}, order), { order_parent_id: id, store_id: store_id, cart_id: null, cart: null, id: null, shipping_methods: [] }));
            const orderResult = await orderRepo.save(childOrder);
            //create shipping methods
            for (const shippingMethod of order.shipping_methods) {
                const newShippingMethod = shippingMethodRepo.create(Object.assign(Object.assign({}, shippingMethod), { id: null, cart_id: null, cart: null, order_id: orderResult.id }));
                await shippingMethodRepo.save(newShippingMethod);
            }
            //create line items
            const items = groupedItems[store_id];
            for (const item of items) {
                const newItem = lineItemRepo.create(Object.assign(Object.assign({}, item), { id: null, order_id: orderResult.id, cart_id: null }));
                await lineItemRepo.save(newItem);
            }
        }
    }
};
OrderSubscriber = __decorate([
    (0, medusa_extender_1.Subscriber)(),
    __metadata("design:paramtypes", [Object])
], OrderSubscriber);
exports.OrderSubscriber = OrderSubscriber;
//# sourceMappingURL=order.subscriber.js.map