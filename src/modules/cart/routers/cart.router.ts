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
       /**
         * Create a cart
         */
        {
            requiredAuth: true,
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
          requiredAuth: true,
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
        requiredAuth: true,
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
        requiredAuth: true,
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
        requiredAuth: true,
        path: '/store/v1/carts/:id/line-items/:line_id',
        method: 'post',
        handlers: [
            middlewares.wrap(updateLineItem)
        ],
      },
      /**
       * Adds a Shipping Method to the Cart
       */
       {
        requiredAuth: true,
        path: '/store/v1/carts/:id/shipping-methods',
        method: 'post',
        handlers: [
            middlewares.wrap(addShippingMethod)
        ],
      }
    ] 
})
export class CartRouter {

}


