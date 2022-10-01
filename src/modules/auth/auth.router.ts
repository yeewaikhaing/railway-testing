import { Router } from 'medusa-extender';

import loginCustomer from './handlers/login-customer';
import getCustomer from './handlers/get-customer';
import logoutCustomer from './handlers/logout-customer';
import checkCustomerEmail from './handlers/check-customer-email';
import checkCustomerPhone from './handlers/check-customer-phone';
import checkCustomerUsername from './handlers/check-customer-username';

import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';

@Router({
    routes: [
         /**
         * Login a Customer
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'post',
        handlers: [
           wrapHandler(loginCustomer)
        ]
    },
        /**
         * Get a logged in customer
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'get',
        handlers: [
           middlewares.authenticate(),
           middlewares.wrap(getCustomer)
        ]
    },
        /**
         * Logout
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'delete',
        handlers: [
           middlewares.authenticate(),
           middlewares.wrap(logoutCustomer)
        ]
    },
         /**
         * Check the email already exist
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth/email/:email',
        method: 'get',
        handlers: [
          wrapHandler(checkCustomerEmail)
        ]
    },
        /**
         * Check the phone already exist
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth/phone/:phone',
        method: 'get',
        handlers: [
          wrapHandler(checkCustomerPhone)
        ]
    },
        /**
         * Check the username already exist
         */
    {
        requiredAuth: true,
        path: '/v1/store/auth/username/:username',
        method: 'get',
        handlers: [
          wrapHandler(checkCustomerUsername)
        ]
    }
] 
})
export class AuthRouter {}