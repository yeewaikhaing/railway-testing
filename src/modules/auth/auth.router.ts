import { Router } from 'medusa-extender';

import loginCustomer from './handlers/get-session';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';

@Router({
    routes: [{
        requiredAuth: true,
        path: '/v1/store/auth',
        method: 'post',
        handlers: [
           // middlewares.authenticate(),
           // middlewares.wrap(loginCustomer)
           wrapHandler(loginCustomer)
        ]
    }] 
})
export class AuthRouter {}