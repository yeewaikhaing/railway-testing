import { Router } from 'medusa-extender';

import loginCustomer from './handlers/customer-login';
import getCustomer from './handlers/get-customer';

import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';

@Router({
    routes: [
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'post',
        handlers: [
           wrapHandler(loginCustomer)
        ]
    },
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'get',
        handlers: [
           // wrapHandler(getCustomer)
           middlewares.authenticate(),
           middlewares.wrap(getCustomer)
        ]
    }
] 
})
export class AuthRouter {}