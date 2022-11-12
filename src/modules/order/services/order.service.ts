import { EntityManager, Brackets } from 'typeorm';
import { OrderService as MedusaOrderService } from "@medusajs/medusa/dist/services";
import { OrderRepository } from '../repositories/order.repository';
import { Service } from 'medusa-extender';
import { User } from "../../user/entities/user.entity";
import {buildQuery} from "@medusajs/medusa/dist/utils";
import { FlagRouter } from '@medusajs/medusa/dist/utils/flag-router';
import { FindConfig, QuerySelector, Selector } from '@medusajs/medusa/dist/types/common';
import { Order } from '../entities/order.entity';
import { TotalsService } from '../../cart/services/totals.service';
import { LineItem } from '../../lineItem/entities/lineItem.entity';
import { MedusaError } from "medusa-core-utils"
import { Fulfillment } from '../../fulfillment/entities/fulfillment.entity';
import { ClaimOrder, Return, Swap } from '@medusajs/medusa';
import { PaymentProviderService } from '../../payment/services/paymentProvider.service';
import { OrderStatus,FulfillmentStatus,PaymentStatus } from "@medusajs/medusa/dist/models/order";


type InjectedDependencies = {
    manager: EntityManager;
    orderRepository: typeof OrderRepository;
    customerService: any;
    paymentProviderService: any;
    shippingOptionService: any;
    shippingProfileService: any;
    discountService: any;
    fulfillmentProviderService: any;
    fulfillmentService: any;
    lineItemService: any;
    totalsService: TotalsService;
    regionService: any;
    cartService: any;
    addressRepository: any;
    giftCardService: any;
    draftOrderService: any;
    inventoryService: any;
    eventBusService: any;
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