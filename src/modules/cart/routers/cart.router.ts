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
    ] 
})
export class CartRouter {

}


