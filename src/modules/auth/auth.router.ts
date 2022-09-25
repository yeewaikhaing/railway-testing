import { Router } from 'medusa-extender';

import loginCustomer from './handlers/login-customer';
import getCustomer from './handlers/get-customer';
import logoutCustomer from './handlers/logout-customer';

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
           middlewares.authenticate(),
           middlewares.wrap(getCustomer)
        ]
    },
    {
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'delete',
        handlers: [
           middlewares.authenticate(),
           middlewares.wrap(logoutCustomer)
        ]
    }
] 
})
export class AuthRouter {}