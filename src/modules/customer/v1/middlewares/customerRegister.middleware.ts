import { 
    Middleware,
    MedusaMiddleware,
    MedusaAuthenticatedRequest,
    MedusaRequest
} from 'medusa-extender';
import { NextFunction, Response } from 'express';

@Middleware({ 
    requireAuth: false, 
    routes: [
        { 
            method: 'post', 
            path: '/v1/store/customers' 
        }
    ],
 })
export class CustomerRegisterMiddleware implements MedusaMiddleware {
    public consume(req: MedusaRequest | Request, res: Response, next: NextFunction): void | Promise<void> {
        return next();
        //return undefined;
    }
}
//CustomerRegisterMiddleware.prototype.consume = 