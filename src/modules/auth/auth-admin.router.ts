import { Router } from 'medusa-extender';

import loginCustomer from './handlers/customer/login';
import getCustomer from './handlers/customer/get-customer';
import logout from './handlers/admin/logout';
import checkPhone from './handlers/admin/check-phone';
import checkEmail from './handlers/admin/check-email';
import checkUsername from './handlers/admin/check-username';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';

@Router({
    routes: [
          /**
         * Check the email already exist
         */
        {
            requiredAuth: true,
            path: '/v1/admin/auth/email/:email',
            method: 'get',
            handlers: [
            wrapHandler(checkEmail)
            ]
        },
          /**
         * Check the phone already exist
         */
        {
            requiredAuth: true,
            path: '/v1/admin/auth/phone/:phone',
            method: 'get',
            handlers: [
            wrapHandler(checkPhone)
            ]
        },
        /**
         * Check the username already exist
         */
        {
            requiredAuth: true,
            path: '/v1/admin/auth/username/:username',
            method: 'get',
            handlers: [
            wrapHandler(checkUsername)
            ]
        },
        /**
         * Logout
         */
        {
            requiredAuth: true,
            path: '/v1/admin/auth',
            method: 'delete',
            handlers: [
            middlewares.authenticate(),
            middlewares.wrap(logout)
            ]
        },
        
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
        
      
        
] 
})
export class AuthRouter {}