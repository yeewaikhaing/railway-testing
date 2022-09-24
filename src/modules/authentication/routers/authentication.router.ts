import { Router } from 'medusa-extender';

import loginCustomer from '../controllers/loginCustomer';

@Router({
    routes: [{
        requiredAuth: false,
        path: '/v1/store/auth',
        method: 'post',
        handlers: [
           // middlewares.authenticate(),
           // middlewares.wrap(loginCustomer)
           loginCustomer
        ]
    }] 
})
export class AuthenticationRouter {}