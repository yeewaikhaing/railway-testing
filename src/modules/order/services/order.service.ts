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