import { Router } from 'medusa-extender';
import { Cart } from '../entities/cart.entity';
import middlewares,{
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import { StorePostCartReq } from "../handlers/create-cart";
import createCart from '../handlers/create-cart';
import getCart from '../handlers/get-cart';
import { FindParams } from '@medusajs/medusa/dist/types/common';
import createLineItem from '../handlers/create-line-item';
import deleteLineItem from '../handlers/delete-line-item';
import updateLineItem from '../handlers/update-line-item';
import addShippingMethod from '../handlers/add-shipping-method';
import removeDiscount from '../handlers/remove-discount';
import createPaymentSession from '../handlers/create-payment-session';
import updatePaymentSession from '../handlers/update-payment-session';
import setPaymentSession from '../handlers/set-payment-session';
import completeCart from '../handlers/complete-cart';
export const defaultStoreCartFields: (keyof Cart)[] = []

export const defaultStoreCartRelations = [
  "gift_cards",
  "region",
  "items",
  "items.adjustments",
  "payment",
  "shipping_address",
  "billing_address",
  "region.countries",
  "region.payment_providers",
  "shipping_methods",
  "payment_sessions",
  "shipping_methods.shipping_option",
  "discounts",
  "discounts.rule",
]
@Router({
    
    routes: 
    [
      // Line items
       /**
         * Create a cart
         */
        {
            requiredAuth: false,
            path: '/store/v1/carts',
            method: 'post',
            handlers: [
                transformBody(StorePostCartReq),
                middlewares.wrap(createCart)
            ],
        }, 
        /**
         * Get a cart
         */
         {
          requiredAuth: false,
          path: '/store/v1/carts/:id',
          method: 'get',
          handlers: [
            transformQuery(FindParams, {
              defaultRelations: defaultStoreCartRelations,
              defaultFields: defaultStoreCartFields,
              isList: false,
            }),
              middlewares.wrap(getCart)
          ],
      }, 
      /**
       * Add a Line Item
       */
      {
        requiredAuth: false,
        path: '/store/v1/carts/:id/line-items',
        method: 'post',
        handlers: [
            middlewares.wrap(createLineItem)
        ],
      },
      /**
       * Delete a Line Item
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/line-items/:line_id',
        method: 'delete',
        handlers: [
            middlewares.wrap(deleteLineItem)
        ],
      },
      /**
       * Update a Line Item
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/line-items/:line_id',
        method: 'post',
        handlers: [
            middlewares.wrap(updateLineItem)
        ],
      },
      /**
       * Removes a Discount from a Cart.
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/discounts/:code',
        method: 'delete',
        handlers: [
            middlewares.wrap(removeDiscount)
        ],
      },
      /**
       * Completes a cart.
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/complete',
        method: 'post',
        handlers: [
            middlewares.wrap(completeCart)
        ],
      },

      // Shipping Options
      /**
       * Adds a Shipping Method to the Cart
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/shipping-methods',
        method: 'post',
        handlers: [
            middlewares.wrap(addShippingMethod)
        ],
      },
      
      // Payment sessions
      /**
       * Creates Payment Sessions for each of the available Payment Providers in the Cart's Region.
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/payment-sessions',
        method: 'post',
        handlers: [
            middlewares.wrap(createPaymentSession)
        ],
      },
      /**
       * Updates a Payment Session with additional data.
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/payment-sessions/:provider_id',
        method: 'post',
        handlers: [
            middlewares.wrap(updatePaymentSession)
        ],
      },
      /**
       * Selects a Payment Session as the session intended to be used towards the completion of the Cart.
       */
       {
        requiredAuth: false,
        path: '/store/v1/carts/:id/payment-session',
        method: 'post',
        handlers: [
            middlewares.wrap(setPaymentSession)
        ],
      },
    ] 
})
export class CartRouter {

}


