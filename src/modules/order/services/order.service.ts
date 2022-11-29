import { EntityManager, Brackets } from 'typeorm';
import { OrderService as MedusaOrderService } from "@medusajs/medusa/dist/services";
import { OrderRepository } from '../repositories/order.repository';
import { Service } from 'medusa-extender';
import { User } from "../../user/entities/user.entity";
import {buildQuery, setMetadata} from "@medusajs/medusa/dist/utils";
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import { FindConfig, QuerySelector, Selector } from '@medusajs/medusa/dist/types/common';
import { Order } from '../entities/order.entity';
import { TotalsService } from '../../cart/services/totals.service';
import { LineItem } from '../../lineItem/entities/lineItem.entity';
import { MedusaError } from "medusa-core-utils"
import { Fulfillment } from '../../fulfillment/entities/fulfillment.entity';
import { ClaimOrder, EventBusService, InventoryService, Return, Swap, TrackingLink } from '@medusajs/medusa';
import { PaymentProviderService } from '../../payment/services/paymentProvider.service';
import { OrderStatus,FulfillmentStatus,PaymentStatus } from "@medusajs/medusa/dist/models/order";
import { UpdateOrderInput } from '../types/orders';
import { Address } from '../../customer/v1/entities/address.entity';
import { AddressRepository } from '../../customer/v1/repositories/address.repository';
import { CustomerService } from '../../customer/v1/services/customer.service';
import { DiscountService } from '../../discount/services/discount.service';
import { FulfillmentProviderService } from '../../fulfillment/services/fulfillmentProvider.service';
import { FulfillmentService } from '../../fulfillment/services/fulfillment.service';
import { LineItemService } from '../../lineItem/services/lineItem.service';
import { RegionService } from '../../region/services/region.service';
import { CartService } from '../../cart/services/cart.service';
import { CreateFulfillmentOrder, FulFillmentItemType } from '../../fulfillment/types/fulfillment';
import { FulfillmentItem } from '../../fulfillment/entities/fulfillmentItem.entity';
import { Payment } from '../../payment/entities/payment.entity';
import { StorePostCartsCartPaymentTypeReq } from '../../cart/handlers/complete-cart';


type InjectedDependencies = {
    manager: EntityManager;
    orderRepository: typeof OrderRepository;
    customerService: CustomerService;
    paymentProviderService: PaymentProviderService;
    shippingOptionService: any;
    shippingProfileService: any;
    discountService: DiscountService;
    fulfillmentProviderService: FulfillmentProviderService;
    fulfillmentService: FulfillmentService;
    lineItemService: LineItemService;
    totalsService: TotalsService;
    regionService: RegionService;
    cartService: CartService;
    addressRepository: typeof AddressRepository;
    giftCardService: any;
    draftOrderService: any;
    inventoryService: InventoryService;
    eventBusService: EventBusService;
    //loggedInUser: User;
    loggedInUser?: User;
    orderService: OrderService;
    featureFlagRouter: FlagRouter;
};

@Service({ scope: 'SCOPED', override: MedusaOrderService })
export class OrderService extends MedusaOrderService {
    static resolutionKey = 'orderService';
    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies) {
        super(container);

        this.manager = container.manager;
        this.container = container;
    }

    /**
   * Updates payment type(cod or prepaid) of the order created from the cartId.
   * @param cartId - id of the cart already created the new order.
   * @param paymentType - the payment type of the new order.
   */
    async updatePaymentType(cartId: string, validated: StorePostCartsCartPaymentTypeReq) {
      let payment_type: string = validated.payment_type;
      // const order = await this.retrieveByCartId(cartId,{
      //   relations: ["payment_sessions"],
      // });
      const order = await this.retrieveByCartId(cartId);
      
      const payment = await this.container.paymentProviderService
                        .retrieveByCartIdAndOrderId(cartId, order.id);
      
      if(payment) {
        await this.container.paymentProviderService
                .updatePayment(payment.id, {
                  payment_type: payment_type
                })
      }

    }
   /**
   * Refunds a given amount back to the customer.
   * @param orderId - id of the order to refund.
   * @param refundAmount - the amount to refund.
   * @param reason - the reason to refund.
   * @param note - note for refund.
   * @param config - the config for refund.
   * @return the result of the refund operation.
   */
  async createRefund(
    orderId: string,
    refundAmount: number,
    reason: string,
    note?: string,
    config: { no_notification?: boolean } = {
      no_notification: undefined,
    }
  ): Promise<Order> {
    const { no_notification } = config

    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, {
        select: ["refundable_amount", "total", "refunded_total"],
        relations: ["payments"],
      })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be refunded"
        )
      }

      if (refundAmount > order.refundable_amount) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot refund more than the original order amount"
        )
      }

      const refund = await this.container.paymentProviderService
        .withTransaction(manager)
        .refundPayment(order.payments, refundAmount, reason, note)

      const result = await this.retrieve(orderId)

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      await this.container.eventBusService.emit(OrderService.Events.REFUND_CREATED, {
        id: result.id,
        refund_id: refund.id,
        no_notification: evaluatedNoNotification,
      })
      return result
    })
  }

    /**
   * Adds a shipment to the order to indicate that an order has left the
   * warehouse. Will ask the fulfillment provider for any documents that may
   * have been created in regards to the shipment.
   * @param orderId - the id of the order that has been shipped
   * @param fulfillmentId - the fulfillment that has now been shipped
   * @param trackingLinks - array of tracking numebers
   *   associated with the shipment
   * @param config - the config of the order that has been shipped
   * @return the resulting order following the update.
   */
  async createShipment(
    orderId: string,
    fulfillmentId: string,
    trackingLinks?: TrackingLink[],
    config: {
      no_notification?: boolean
      metadata: Record<string, unknown>
    } = {
      metadata: {},
      no_notification: undefined,
    }
  ): Promise<Order> {
    const { metadata, no_notification } = config

    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, { relations: ["items"] })
      const shipment = await this.container.fulfillmentService
        .withTransaction(manager)
        .retrieve(fulfillmentId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be fulfilled as shipped"
        )
      }

      if (!shipment || shipment.order_id !== orderId) {
        throw new MedusaError(
          MedusaError.Types.NOT_FOUND,
          "Could not find fulfillment"
        )
      }

      const evaluatedNoNotification =
        no_notification !== undefined
          ? no_notification
          : shipment.no_notification

      const shipmentRes = await this.container.fulfillmentService
        .withTransaction(manager)
        .createShipment(fulfillmentId, trackingLinks, {
          metadata,
          no_notification: evaluatedNoNotification,
        })

      const lineItemServiceTx = this.container.lineItemService.withTransaction(manager)

      order.fulfillment_status = FulfillmentStatus.SHIPPED
      for (const item of order.items) {
        const shipped = shipmentRes.items.find((si) => si.item_id === item.id)
        if (shipped) {
          const shippedQty = (item.shipped_quantity || 0) + shipped.quantity
          if (shippedQty !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }

          await lineItemServiceTx.update(item.id, {
            shipped_quantity: shippedQty,
          })
        } else {
          if (item.shipped_quantity !== item.quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_SHIPPED
          }
        }
      }

      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      const result = await orderRepo.save(order)

      await this.container.eventBusService
        .withTransaction(manager)
        .emit(OrderService.Events.SHIPMENT_CREATED, {
          id: orderId,
          fulfillment_id: shipmentRes.id,
          no_notification: evaluatedNoNotification,
        })

      return result
    })
  }

  /**
   * Cancels a fulfillment (if related to an order)
   * @param fulfillmentId - the ID of the fulfillment to cancel
   * @return updated order
   */
   async cancelFulfillment(fulfillmentId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const canceled = await this.container.fulfillmentService
        .withTransaction(manager)
        .cancelFulfillment(fulfillmentId)

      if (!canceled.order_id) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Fufillment not related to an order`
        )
      }

      const order = await this.retrieve(canceled.order_id)

      order.fulfillment_status = FulfillmentStatus.CANCELED

      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      const updated = await orderRepo.save(order)

      await this.container.eventBusService
        .withTransaction(manager)
        .emit(OrderService.Events.FULFILLMENT_CANCELED, {
          id: order.id,
          fulfillment_id: canceled.id,
          no_notification: canceled.no_notification,
        })

      return updated
    })
  }
    /**
   * Captures payment for an order.
   * @param orderId - id of order to capture payment for.
   * @return result of the update operation.
   */
  async capturePayment(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      const order = await this.retrieve(orderId, { relations: ["payments"] })

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot capture payment"
        )
      }

      const paymentProviderServiceTx : PaymentProviderService =
        this.container.paymentProviderService.withTransaction(manager)

      const payments: Payment[] = []
      for (const p of order.payments) {
        if (p.captured_at === null) {
          const result = await paymentProviderServiceTx
            .capturePayment(p)
            .catch(async (err) => {
              await this.container.eventBusService
                .withTransaction(manager)
                .emit(OrderService.Events.PAYMENT_CAPTURE_FAILED, {
                  id: orderId,
                  payment_id: p.id,
                  error: err,
                  no_notification: order.no_notification,
                })
            })

          if (result) {
            payments.push(result)
          } else {
            payments.push(p)
          }
        } else {
          payments.push(p)
        }
      }

      order.payments = payments
      order.payment_status = payments.every((p) => p.captured_at !== null)
        ? PaymentStatus.CAPTURED
        : PaymentStatus.REQUIRES_ACTION

      const result = await orderRepo.save(order)

      if (order.payment_status === PaymentStatus.CAPTURED) {
        await this.container.eventBusService
          .withTransaction(manager)
          .emit(OrderService.Events.PAYMENT_CAPTURED, {
            id: result.id,
            no_notification: order.no_notification,
          })
      }

      return result
    })
  }

    /**
   * Updates an order. Metadata updates should
   * use dedicated method, e.g. `setMetadata` etc. The function
   * will throw errors if metadata updates are attempted.
   * @param orderId - the id of the order. Must be a string that
   *   can be casted to an ObjectId
   * @param update - an object with the update values.
   * @return resolves to the update result.
   */
  async update(orderId: string, update: UpdateOrderInput): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be updated"
        )
      }

      if (
        (update.payment || update.items) &&
        (order.fulfillment_status !== "not_fulfilled" ||
          order.payment_status !== "awaiting" ||
          order.status !== "pending")
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update shipping, billing, items and payment method when order is processed"
        )
      }

      if (update.status || update.fulfillment_status || update.payment_status) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't update order statuses. This will happen automatically. Use metadata in order for additional statuses"
        )
      }

      const {
        metadata,
        shipping_address,
        billing_address,
        no_notification,
        items,
        ...rest
      } = update

      if (update.metadata) {
        order.metadata = setMetadata(order, metadata ?? {})
      }

      if (update.shipping_address) {
        await this.updateShippingAddress(order, shipping_address as Address)
      }

      if (update.billing_address) {
        await this.updateBillingAddress(order, billing_address as Address)
      }

      if (update.no_notification) {
        order.no_notification = no_notification ?? false
      }

      const lineItemServiceTx = this.container.lineItemService.withTransaction(manager)
      if (update.items) {
        for (const item of items as LineItem[]) {
          await lineItemServiceTx.create({
            ...item,
            order_id: orderId,
          })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        order[key] = value
      }

      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      const result = await orderRepo.save(order)

      await this.container.eventBusService
        .withTransaction(manager)
        .emit(OrderService.Events.UPDATED, {
          id: orderId,
          no_notification: order.no_notification,
        })
      return result
    })
  }

  

  /**
   * Updates the order's billing address.
   * @param order - the order to update
   * @param address - the value to set the billing address to
   * @return the result of the update operation
   */
   protected async updateBillingAddress(
    order: Order,
    address: Address
  ): Promise<void> {
    const addrRepo = this.manager.getCustomRepository(this.container.addressRepository)
    address.country_code = address.country_code?.toLowerCase() ?? null

    const region = await this.container.regionService
      .withTransaction(this.manager)
      .retrieve(order.region_id, {
        relations: ["countries"],
      })

    if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the order region"
      )
    }

    address.country_code = address.country_code?.toLowerCase() ?? null

    if (order.billing_address_id) {
      const addr = await addrRepo.findOne({
        where: { id: order.billing_address_id },
      })

      await addrRepo.save({ ...addr, ...address })
    } else {
      const created = addrRepo.create({ ...address })
      await addrRepo.save(created)
    }
  }

   /**
   * Updates the order's shipping address.
   * @param order - the order to update
   * @param address - the value to set the shipping address to
   * @return the result of the update operation
   */
    protected async updateShippingAddress(
      order: Order,
      address: Address
    ): Promise<void> {
      const addrRepo = this.manager.getCustomRepository(this.container.addressRepository)
      address.country_code = address.country_code?.toLowerCase() ?? null
  
      const region = await this.container.regionService
        .withTransaction(this.manager)
        .retrieve(order.region_id, {
          relations: ["countries"],
        })
  
      if (!region.countries.find(({ iso_2 }) => address.country_code === iso_2)) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Shipping country must be in the order region"
        )
      }
  
      if (order.shipping_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: order.shipping_address_id },
        })
  
        await addrRepo.save({ ...addr, ...address })
      } else {
        const created = addrRepo.create({ ...address })
        await addrRepo.save(created)
      }
    }
  
    /**
   * Archives an order. It only alloved, if the order has been fulfilled
   * and payment has been captured.
   * @param orderId - the order to archive
   * @return the result of the update operation
   */
  async archive(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status !== ("completed" || "refunded")) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Can't archive an unprocessed order"
        )
      }

      order.status = OrderStatus.ARCHIVED
      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      return await orderRepo.save(order)
    })
  }

  /**
   * @param orderId - id of the order to complete
   * @return the result of the find operation
   */
   async completeOrder(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId)

      if (order.status === "canceled") {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be completed"
        )
      }

      await this.container.eventBusService.emit(OrderService.Events.COMPLETED, {
        id: orderId,
        no_notification: order.no_notification,
      })

      order.status = OrderStatus.COMPLETED

      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      return orderRepo.save(order)
    })
  }

  /**
   * Creates fulfillments for an order.
   * In a situation where the order has more than one shipping method,
   * we need to partition the order items, such that they can be sent
   * to their respective fulfillment provider.
   * @param orderId - id of order to cancel.
   * @param itemsToFulfill - items to fulfil.
   * @param config - the config to cancel.
   * @return result of the update operation.
   */
   async createFulfillment(
    orderId: string,
    itemsToFulfill: FulFillmentItemType[],
    config: {
      no_notification?: boolean
      metadata?: Record<string, unknown>
    } = {
      no_notification: undefined,
      metadata: {},
    }
  ): Promise<Order> {
    const { metadata, no_notification } = config

    return await this.atomicPhase_(async (manager) => {
      // NOTE: we are telling the service to calculate all totals for us which
      // will add to what is fetched from the database. We want this to happen
      // so that we get all order details. These will thereafter be forwarded
      // to the fulfillment provider.
      const order = await this.retrieve(orderId, {
        select: [
          "subtotal",
          "shipping_total",
          "discount_total",
          "tax_total",
          "gift_card_total",
          "total",
        ],
        relations: [
          "discounts",
          "discounts.rule",
          "region",
          "fulfillments",
          "shipping_address",
          "billing_address",
          "shipping_methods",
          "shipping_methods.shipping_option",
          "items",
          "items.adjustments",
          "items.variant",
          "items.variant.product",
          "payments",
        ],
      })

      if (order.status === OrderStatus.CANCELED) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "A canceled order cannot be fulfilled"
        )
      }

      if (!order.shipping_methods?.length) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Cannot fulfill an order that lacks shipping methods"
        )
      }

      const fulfillments = await this.container.fulfillmentService
        .withTransaction(manager)
        .createFulfillment(
          order as unknown as CreateFulfillmentOrder,
          itemsToFulfill,
          {
            metadata,
            no_notification: no_notification,
            order_id: orderId,
          }
        )
      let successfullyFulfilled: FulfillmentItem[] = []
      for (const f of fulfillments) {
        successfullyFulfilled = [...successfullyFulfilled, ...f.items]
      }

      order.fulfillment_status = FulfillmentStatus.FULFILLED

      // Update all line items to reflect fulfillment
      for (const item of order.items) {
        const fulfillmentItem = successfullyFulfilled.find(
          (f) => item.id === f.item_id
        )

        if (fulfillmentItem) {
          const fulfilledQuantity =
            (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

          // Update the fulfilled quantity
          await this.container.lineItemService.withTransaction(manager).update(item.id, {
            fulfilled_quantity: fulfilledQuantity,
          })

          if (item.quantity !== fulfilledQuantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_FULFILLED
          }
        } else {
          if (item.quantity !== item.fulfilled_quantity) {
            order.fulfillment_status = FulfillmentStatus.PARTIALLY_FULFILLED
          }
        }
      }
      const orderRepo = manager.getCustomRepository(this.container.orderRepository)

      order.fulfillments = [...order.fulfillments, ...fulfillments]

      const result = await orderRepo.save(order)

      const evaluatedNoNotification =
        no_notification !== undefined ? no_notification : order.no_notification

      const eventBusTx = this.container.eventBusService.withTransaction(manager)
      for (const fulfillment of fulfillments) {
        await eventBusTx.emit(OrderService.Events.FULFILLMENT_CREATED, {
          id: orderId,
          fulfillment_id: fulfillment.id,
          no_notification: evaluatedNoNotification,
        })
      }

      return result
    })
  }

  
  /**
   * Cancels an order.
   * Throws if fulfillment process has been initiated.
   * Throws if payment process has been initiated.
   * @param orderId - id of order to cancel.
   * @return result of the update operation.
   */
   async cancel(orderId: string): Promise<Order> {
    return await this.atomicPhase_(async (manager) => {
      const order = await this.retrieve(orderId, {
        relations: [
          "fulfillments",
          "payments",
          "returns",
          "claims",
          "swaps",
          "items",
        ],
      })

      if (order.refunds?.length > 0) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          "Order with refund(s) cannot be canceled"
        )
      }

      const throwErrorIf = (
        arr: (Fulfillment | Return | Swap | ClaimOrder)[],
        pred: (obj: Fulfillment | Return | Swap | ClaimOrder) => boolean,
        type: string
      ): void | never => {
        if (arr?.filter(pred).length) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `All ${type} must be canceled before canceling an order`
          )
        }
      }

      const notCanceled = (o): boolean => !o.canceled_at

      throwErrorIf(order.fulfillments, notCanceled, "fulfillments")
      throwErrorIf(
        order.returns,
        (r) => (r as Return).status !== "canceled",
        "returns"
      )
      throwErrorIf(order.swaps, notCanceled, "swaps")
      throwErrorIf(order.claims, notCanceled, "claims")

      const inventoryServiceTx = this.container.inventoryService.withTransaction(manager)
      for (const item of order.items) {
        await inventoryServiceTx.adjustInventory(item.variant_id, item.quantity)
      }

      const paymentProviderServiceTx : PaymentProviderService =
        this.container.paymentProviderService.withTransaction(manager)
      for (const p of order.payments) {
        await paymentProviderServiceTx.cancelPayment(p)
      }

      order.status = OrderStatus.CANCELED
      order.fulfillment_status = FulfillmentStatus.CANCELED
      order.payment_status = PaymentStatus.CANCELED
      order.canceled_at = new Date()

      const orderRepo = manager.getCustomRepository(this.container.orderRepository)
      const result = await orderRepo.save(order)

      await this.container.eventBusService
        .withTransaction(manager)
        .emit(OrderService.Events.CANCELED, {
          id: order.id,
          no_notification: order.no_notification,
        })
      return result
    })
  }

    /**
   * @param selector the query object for find
   * @param config the config to be used for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<Order[]> {
    const [orders] = await this.listAndCount(selector, config)
    return orders
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config to be used for find
   * @return {Promise} the result of the find operation
   */
   async listAndCount(
    selector: QuerySelector<Order>,
    config: FindConfig<Order> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<[Order[], number]> {
    const orderRepo = this.manager.getCustomRepository(this.container.orderRepository)

    let q
    if (selector.q) {
      q = selector.q
      delete selector.q
    }

    //const query = buildQuery(selector, config)
    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.display_id
      delete where.email

      query.join = {
        alias: "order",
        innerJoin: {
          shipping_address: "order.shipping_address",
        },
      }

      query.where = (qb): void => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where(`shipping_address.first_name ILIKE :qfn`, {
              qfn: `%${q}%`,
            })
              .orWhere(`order.email ILIKE :q`, { q: `%${q}%` })
              .orWhere(`display_id::varchar(255) ILIKE :dId`, { dId: `${q}` })
          })
        )
      }
    }

    const { select, relations, totalsToSelect } =
      this.myTransformQueryForTotals(config)

    query.select = select
    const rels = relations

    delete query.relations

    const raw = await orderRepo.findWithRelations(rels, query)
    const count = await orderRepo.count(query)
    const orders = await Promise.all(
      raw.map(async (r) => await this.decorateTotals(r, totalsToSelect))
    )

    return [orders, count]
  }

    /**
   * Gets an order by id.
   * @param orderId - id of order to retrieve
   * @param config - config of order to retrieve
   * @return the order document
   */
  async retrieve(
    orderId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    const orderRepo = this.manager.getCustomRepository(this.container.orderRepository)

    const { select, relations, totalsToSelect } =
      this.myTransformQueryForTotals(config)

    const query = {
      where: { id: orderId },
    } as FindConfig<Order>

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    query.select = select?.length ? select : undefined

    const rels = query.relations
    delete query.relations
    const raw = await orderRepo.findOneWithRelations(rels, query)
    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with ${orderId} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
  }

  
    /**
   * Gets an order by cart id.
   * @param cartId - cart id to find order
   * @param config - the config to be used to find order
   * @return the order document
   */
  async retrieveByCartId(
    cartId: string,
    config: FindConfig<Order> = {}
  ): Promise<Order> {
    const orderRepo = this.manager.getCustomRepository(this.container.orderRepository)

    const { select, relations, totalsToSelect } =
      this.myTransformQueryForTotals(config)

    const query = {
      where: { cart_id: cartId },
    } as FindConfig<Order>

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    query.select = select?.length ? select : undefined

    const raw = await orderRepo.findOne(query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Order with cart id: ${cartId} was not found`
      )
    }

    return await this.decorateTotals(raw, totalsToSelect)
  }

  protected async decorateTotals(
    order: Order,
    totalsFields: string[] = []
  ): Promise<Order> {
    for (const totalField of totalsFields) {
      switch (totalField) {
        case "shipping_total": {
          order.shipping_total = await this.container.totalsService.getShippingTotal(
            order
          )
          break
        }
        case "gift_card_total": {
          const giftCardBreakdown = await this.container.totalsService.getGiftCardTotal(
            order
          )
          order.gift_card_total = giftCardBreakdown.total
          order.gift_card_tax_total = giftCardBreakdown.tax_total
          break
        }
        case "discount_total": {
          order.discount_total = await this.container.totalsService.getDiscountTotal(
            order
          )
          break
        }
        case "tax_total": {
          order.tax_total = await this.container.totalsService.getTaxTotal(order)
          break
        }
        case "subtotal": {
          order.subtotal = await this.container.totalsService.getSubtotal(order)
          break
        }
        case "total": {
          order.total = await this.container.totalsService
            .withTransaction(this.manager)
            .getTotal(order)
          break
        }
        case "refunded_total": {
          order.refunded_total = this.container.totalsService.getRefundedTotal(order)
          break
        }
        case "paid_total": {
          order.paid_total = this.container.totalsService.getPaidTotal(order)
          break
        }
        case "refundable_amount": {
          const paid_total = this.container.totalsService.getPaidTotal(order)
          const refunded_total = this.container.totalsService.getRefundedTotal(order)
          order.refundable_amount = paid_total - refunded_total
          break
        }
        case "items.refundable": {
          const items: LineItem[] = []
          for (const item of order.items) {
            items.push({
              ...item,
              refundable: await this.container.totalsService.getLineItemRefund(order, {
                ...item,
                quantity: item.quantity - (item.returned_quantity || 0),
              } as LineItem),
            } as LineItem)
          }
          order.items = items
          break
        }
        case "swaps.additional_items.refundable": {
          for (const s of order.swaps) {
            const items: LineItem[] = []
            for (const item of s.additional_items) {
              items.push({
                ...item,
                refundable: await this.container.totalsService.getLineItemRefund(order, {
                  ...item,
                  quantity: item.quantity - (item.returned_quantity || 0),
                } as LineItem),
              } as LineItem)
            }
            s.additional_items = items
          }
          break
        }
        case "claims.additional_items.refundable": {
          for (const c of order.claims) {
            const items: LineItem[] = []
            for (const item of c.additional_items) {
              items.push({
                ...item,
                refundable: await this.container.totalsService.getLineItemRefund(order, {
                  ...item,
                  quantity: item.quantity - (item.returned_quantity || 0),
                } as LineItem),
              } as LineItem)
            }
            c.additional_items = items
          }
          break
        }
        default: {
          break
        }
      }
    }
    return order
  }

  protected myTransformQueryForTotals(config: FindConfig<Order>): {
    relations: string[] | undefined
    select: FindConfig<Order>["select"]
    totalsToSelect: FindConfig<Order>["select"]
  } {
    let { select, relations } = config

    if (!select) {
      return {
        select,
        relations,
        totalsToSelect: [],
      }
    }

    const totalFields = [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "gift_card_total",
      "total",
      "paid_total",
      "refunded_total",
      "refundable_amount",
      "items.refundable",
      "swaps.additional_items.refundable",
      "claims.additional_items.refundable",
    ]

    const totalsToSelect = select.filter((v) => totalFields.includes(v))
    if (totalsToSelect.length > 0) {
      const relationSet = new Set(relations)
      relationSet.add("items")
      relationSet.add("items.tax_lines")
      relationSet.add("items.adjustments")
      relationSet.add("swaps")
      relationSet.add("swaps.additional_items")
      relationSet.add("swaps.additional_items.tax_lines")
      relationSet.add("swaps.additional_items.adjustments")
      relationSet.add("claims")
      relationSet.add("claims.additional_items")
      relationSet.add("claims.additional_items.tax_lines")
      relationSet.add("claims.additional_items.adjustments")
      relationSet.add("discounts")
      relationSet.add("discounts.rule")
      relationSet.add("gift_cards")
      relationSet.add("gift_card_transactions")
      relationSet.add("refunds")
      relationSet.add("shipping_methods")
      relationSet.add("shipping_methods.tax_lines")
      relationSet.add("region")
      relations = [...relationSet]

      select = select.filter((v) => !totalFields.includes(v))
    }

    const toSelect = select
    if (toSelect.length > 0 && toSelect.indexOf("tax_rate") === -1) {
      toSelect.push("tax_rate")
    }

    return {
      relations,
      select: toSelect.length ? toSelect : undefined,
      totalsToSelect,
    }
  }

    // buildQuery_(
    //   selector: object, 
    //   config: {relations: string[], 
    //   select: string[]}
    //   ): object {
      buildQuery_(
        selector: QuerySelector<Order>, 
        config: FindConfig<Order> = {
          skip: 0,
          take: 50,
          order: { created_at: "DESC" },
        }) {
      
      console.log("buildQuery-----");
      
      if (this.container.loggedInUser && this.container.loggedInUser.store_id) {
            console.log("---loginUser exist");
            
            selector['store_id'] = this.container.loggedInUser.store_id;
        }
        // if (Object.keys(this.container).includes('loggedInUser') && this.container.loggedInUser.store_id) {
        //     selector['store_id'] = this.container.loggedInUser.store_id;
        // }
        config.select.push('store_id')

        config.relations = config.relations ?? []

        config.relations.push("children", "parent", "store")

        return buildQuery(selector, config);
    }
}