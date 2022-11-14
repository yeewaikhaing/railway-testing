import { Router } from 'medusa-extender';
import middlewares,{
    transformBody,
    transformQuery,
  }  from '@medusajs/medusa/dist/api/middlewares';
import {AdminGetOrdersParams} from "../handlers/admin/list-orders";
import { Order } from '../entities/order.entity';
import { FindParams } from "@medusajs/medusa/dist/types/common";
import listOrders from '../handlers/admin/list-orders';
import getOrder from '../handlers/admin/get-order';
import updateOrder from '../handlers/admin/update-order';
import cancelOrder from '../handlers/admin/cancel-order';
import createFulfillment from '../handlers/admin/create-fulfillment';
import completeOrder from '../handlers/admin/complete-order';
import capturePayment from '../handlers/admin/capture-payment';

export const defaultAdminOrdersRelations = [
    "customer",
    "store",
    "billing_address",
    "shipping_address",
    "discounts",
    "discounts.rule",
    "shipping_methods",
    "payments",
    "fulfillments",
    "fulfillments.tracking_links",
    "fulfillments.items",
    "returns",
    "returns.shipping_method",
    "returns.shipping_method.tax_lines",
    "returns.items",
    "returns.items.reason",
    "gift_cards",
    "gift_card_transactions",
    "claims",
    "claims.return_order",
    "claims.return_order.shipping_method",
    "claims.return_order.shipping_method.tax_lines",
    "claims.shipping_methods",
    "claims.shipping_address",
    "claims.additional_items",
    "claims.fulfillments",
    "claims.fulfillments.tracking_links",
    "claims.claim_items",
    "claims.claim_items.item",
    "claims.claim_items.images",
    // "claims.claim_items.tags",
    "swaps",
    "swaps.return_order",
    "swaps.return_order.shipping_method",
    "swaps.return_order.shipping_method.tax_lines",
    "swaps.payment",
    "swaps.shipping_methods",
    "swaps.shipping_methods.tax_lines",
    "swaps.shipping_address",
    "swaps.additional_items",
    "swaps.fulfillments",
    "swaps.fulfillments.tracking_links",
  ]

const relations = [...defaultAdminOrdersRelations];

export const defaultAdminOrdersFields = [
    "id",
    "status",
    "store_id",
    "fulfillment_status",
    "payment_status",
    "display_id",
    "cart_id",
    "draft_order_id",
    "customer_id",
    "email",
    "region_id",
    "currency_code",
    "tax_rate",
    "canceled_at",
    "created_at",
    "updated_at",
    "metadata",
    "items.refundable",
    "swaps.additional_items.refundable",
    "claims.additional_items.refundable",
    "shipping_total",
    "discount_total",
    "tax_total",
    "refunded_total",
    "gift_card_total",
    "subtotal",
    "total",
    "paid_total",
    "refundable_amount",
    "no_notification",
  ] as (keyof Order)[]

  export const allowedAdminOrdersFields = [
    "id",
    "status",
    "store_id",
    "fulfillment_status",
    "payment_status",
    "display_id",
    "cart_id",
    "draft_order_id",
    "customer_id",
    "email",
    "region_id",
    "currency_code",
    "tax_rate",
    "canceled_at",
    "created_at",
    "updated_at",
    "metadata",
    "shipping_total",
    "discount_total",
    "tax_total",
    "refunded_total",
    "subtotal",
    "gift_card_total",
    "total",
    "paid_total",
    "refundable_amount",
    "no_notification",
  ]  

  export const allowedAdminOrdersRelations = [
    "customer",
    "store",
    "region",
    "edits",
    "sales_channel",
    "billing_address",
    "shipping_address",
    "discounts",
    "discounts.rule",
    "shipping_methods",
    "payments",
    "fulfillments",
    "fulfillments.tracking_links",
    "returns",
    "claims",
    "swaps",
    "swaps.return_order",
    "swaps.additional_items",
  ]
  
@Router({
    routes: 
    [
       /**
         * Retrieves a list of Orders.
         */
        {
            requiredAuth: true,
            path: '/admin/v1/orders',
            method: 'get',
            handlers: [
                transformQuery(AdminGetOrdersParams, {
                    defaultRelations: relations,
                    defaultFields: defaultAdminOrdersFields,
                    allowedFields: allowedAdminOrdersFields,
                    allowedRelations: allowedAdminOrdersRelations,
                    isList: true,
                  }),
                middlewares.authenticate(),
                middlewares.wrap(listOrders)
            ],
        },
        /**
         * Retrieves an Order.
         */
         {
          requiredAuth: true,
          path: '/admin/v1/orders/:id',
          method: 'get',
          handlers: [
            transformQuery(FindParams, {
              defaultRelations: relations,
              defaultFields: defaultAdminOrdersFields,
              allowedFields: allowedAdminOrdersFields,
              allowedRelations: allowedAdminOrdersRelations,
              isList: false,
            }),
              middlewares.authenticate(),
              middlewares.wrap(getOrder)
          ],
      },
      /**
       * Updates an Order.
       */
       {
        requiredAuth: true,
        path: '/admin/v1/orders/:id',
        method: 'post',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(updateOrder)
        ],
      },
      /**
       * Cancel an Order.
       */
       {
        requiredAuth: true,
        path: '/admin/v1/orders/:id/cancel',
        method: 'post',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(cancelOrder)
        ],
      },
      /**
       * Creates a Fulfillment of an Order - will notify Fulfillment Providers to prepare a shipment.
       */
       {
        requiredAuth: true,
        path: '/admin/v1/orders/:id/fulfillment',
        method: 'post',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(createFulfillment)
        ],
      },
      /**
       * Completes an Order.
       */
       {
        requiredAuth: true,
        path: '/admin/v1/orders/:id/complete',
        method: 'post',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(completeOrder)
        ],
      },
      /**
       * Captures all the Payments associated with an Order.
       */
       {
        requiredAuth: true,
        path: '/admin/v1/orders/:id/capture',
        method: 'post',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(capturePayment)
        ],
      },
    ] 
})
export class AdminOrderRouter {}

  