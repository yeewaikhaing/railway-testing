import { Router } from 'medusa-extender';

import loginCustomer from './handlers/customer/login';
import getCustomer from './handlers/customer/get-customer';
import logoutCustomer from './handlers/customer/logout';
import checkCustomerEmail from './handlers/customer/check-email';
import checkCustomerPhone from './handlers/customer/check-phone';
import checkCustomerUsername from './handlers/customer/check-username';

import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';

@Router({
    routes: [
         /**
         * Login a Customer
         */
    {
        requiredAuth: true,
        path: '/store/v1/auth',
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
        path: '/store/v1/auth',
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
        path: '/store/v1/auth',
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
        path: '/store/v1/auth/email/:email',
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
        path: '/store/v1/auth/phone/:phone',
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
        path: '/store/v1/auth/username/:user_name',
        method: 'get',
        handlers: [
          wrapHandler(checkCustomerUsername)
        ]
    }
] 
})
export class CustomerAuthRouter {}