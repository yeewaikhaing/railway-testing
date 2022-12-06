import { Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import addCurrencyCode from '../handlers/add-currency-code';
import removeCurrencyCode from '../handlers/remove-currency-code';
import updateStore from '../handlers/update-store';
import getStoreDetails from '../handlers/get-store-details';
import listPaymentProviders from '../handlers/list-payment-providers';

@Router({
    routes: 
    [
        /**
         * Add a Currency Code
         */
         {
            requiredAuth: true,
            path: '/admin/v1/store/currencies/:currency_code',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(addCurrencyCode),
            ],
        },
        /**
         * Remove a Currency Code
         */
         {
            requiredAuth: true,
            path: '/admin/v1/store/currencies/:currency_code',
            method: 'delete',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(removeCurrencyCode),
            ],
        },
        /**
         * Update Store Profile
         */
         {
            requiredAuth: true,
            path: '/admin/v1/store',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(updateStore),
            ],
        },
        /**
         * Get Store Profile
         */
         {
            requiredAuth: true,
            path: '/admin/v1/store',
            method: 'get',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(getStoreDetails),
            ],
        },
        /**
         * List payment providers of store
         */
         {
            requiredAuth: true,
            path: '/admin/v1/store/payment-providers',
            method: 'get',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(listPaymentProviders),
            ],
        },
    ] 
})
export class StoreRouter {}