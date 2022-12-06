import {  Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import listOptions from '../handlers/list-options';
import listOptionsForCart from '../handlers/list-options-for-cart';

@Router({
    routes: 
    [
        /**
         * Retrieves a list of Shipping Options
         */
         {
            requiredAuth: false,
            path: '/store/v1/shipping-options',
            method: 'get',
            handlers: [
                middlewares.wrap(listOptions)
            ],
        },
        /**
         * Retrieves a list of Shipping Options available to a cart.
         */
         {
            requiredAuth: false,
            path: '/store/v1/shipping-options/:cart_id',
            method: 'get',
            handlers: [
                middlewares.wrap(listOptionsForCart)
            ],
        },
    ] 
})
export class ShippingRouter {}