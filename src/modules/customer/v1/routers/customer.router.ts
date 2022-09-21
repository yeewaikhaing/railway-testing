import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import { Response, NextFunction } from "express";
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import getCustomerHandler from '@medusajs/medusa/dist/api/routes/store/customers/get-customer'
import createCustomer from '../controllers/createCustomer.controller';
@Router({
    routes: [{
        requiredAuth: false,
        path: '/v1/store/customers',
        method: 'post',
        handlers: [
            createCustomer,
            // async (req: Request, res: Response, next: NextFunction): Promise<Response<User[]>> => {
            //     /* You can create a function in a separate find and just imported it here. */
            //     //const userService = req.scope.resolve('userService') as UserService;
            //     //const users = await userService.list({})
            //     return res.send('good luck');
            // }
            // (req: Request, res: Response, next: NextFunction) => {
            //     /* You can create a function in a separate find and just imported it here. */
            //     //const userService = req.scope.resolve('userService') as UserService;
            //     //const users = await userService.list({})
            //     return res.send('good luck');
            // }
        ],
    },
    {
        requiredAuth: true,
        path: '/v1/store/customers/me',
        method: 'get',
        handlers: [
            wrapHandler(getCustomerHandler)
        ],
       
    }
] 
})
export class CustomerRouter {}