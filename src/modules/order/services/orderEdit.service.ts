import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import {default as MedusaOrderEditService } from "@medusajs/medusa/dist/services/order-edit";
import { OrderEditRepository } from '../repositories/orderEdit.repository';
import { OrderService } from './order.service';
import { TotalsService } from '../../cart/services/totals.service';
import { LineItemService } from '../../lineItem/services/lineItem.service';
import { EventBusService, LineItemAdjustmentService, OrderEditItemChangeService, TaxProviderService } from '@medusajs/medusa/dist/services';
import { FindConfig } from '@medusajs/medusa/dist/types/common';
import { OrderEdit } from '../entities/orderEdit.entity';
import { buildQuery } from '@medusajs/medusa/dist/utils';
import { MedusaError } from "medusa-core-utils"
import { Order } from '../entities/order.entity';

type InjectedDependencies = {
    manager: EntityManager
    orderEditRepository: typeof OrderEditRepository
  
    orderService: OrderService
    totalsService: TotalsService
    lineItemService: LineItemService
    eventBusService: EventBusService
    taxProviderService: TaxProviderService
    lineItemAdjustmentService: LineItemAdjustmentService
    orderEditItemChangeService: OrderEditItemChangeService
  }
  

@Service({override: MedusaOrderEditService})
export class OrderEditService extends MedusaOrderEditService {
    static resolutionKey = 'orderEditService';

    private readonly manager: EntityManager;
    private readonly container: InjectedDependencies;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        this.container = container;
        this.manager = container.manager;
    }

    async decorateTotals(orderEdit: OrderEdit): Promise<OrderEdit> {
        const totals = await this.getTotals(orderEdit.id)
        orderEdit.discount_total = totals.discount_total
        orderEdit.gift_card_total = totals.gift_card_total
        orderEdit.gift_card_tax_total = totals.gift_card_tax_total
        orderEdit.shipping_total = totals.shipping_total
        orderEdit.subtotal = totals.subtotal
        orderEdit.tax_total = totals.tax_total
        orderEdit.total = totals.total
        orderEdit.difference_due = totals.difference_due
    
        return orderEdit
      }
    
      /**
   * Compute and return the different totals from the order edit id
   * @param orderEditId
   */
  async getTotals(orderEditId: string): Promise<{
    shipping_total: number
    gift_card_total: number
    gift_card_tax_total: number
    discount_total: number
    tax_total: number | null
    subtotal: number
    difference_due: number
    total: number
  }> {
    const manager = this.transactionManager_ ?? this.manager
    const { order_id, items } = await this.retrieve(orderEditId, {
      select: ["id", "order_id", "items"],
      relations: ["items", "items.tax_lines", "items.adjustments"],
    })

    const order = await this.container.orderService
      .withTransaction(manager)
      .retrieve(order_id, {
        relations: [
          "discounts",
          "discounts.rule",
          "gift_cards",
          "region",
          "items",
          "items.tax_lines",
          "items.adjustments",
          "region.tax_rates",
          "shipping_methods",
          "shipping_methods.tax_lines",
        ],
      })
    const computedOrder = { ...order, items } as Order

    const totalsServiceTx = this.container.totalsService.withTransaction(manager)

    const shipping_total = await totalsServiceTx.getShippingTotal(computedOrder)
    const { total: gift_card_total, tax_total: gift_card_tax_total } =
      await totalsServiceTx.getGiftCardTotal(computedOrder)
    const discount_total = await totalsServiceTx.getDiscountTotal(computedOrder)
    const tax_total = await totalsServiceTx.getTaxTotal(computedOrder)
    const subtotal = await totalsServiceTx.getSubtotal(computedOrder)
    const total = await totalsServiceTx.getTotal(computedOrder)

    const orderTotal = await totalsServiceTx.getTotal(order)
    const difference_due = total - orderTotal

    return {
      shipping_total,
      gift_card_total,
      gift_card_tax_total,
      discount_total,
      tax_total,
      subtotal,
      total,
      difference_due,
    }
  }

    async retrieve(
        orderEditId: string,
        config: FindConfig<OrderEdit> = {}
      ): Promise<OrderEdit> {
        const manager = this.transactionManager_ ?? this.manager
        const orderEditRepository = manager.getCustomRepository(
          this.container.orderEditRepository
        )
    
        const query = buildQuery({ id: orderEditId }, config)
        const orderEdit = await orderEditRepository.findOne(query)
    
        if (!orderEdit) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Order edit with id ${orderEditId} was not found`
          )
        }
    
        return orderEdit
      }
    
}