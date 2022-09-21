import { 
    Middleware,
    MedusaMiddleware,
    MedusaAuthenticatedRequest
} from 'medusa-extender';
import { NextFunction, Response } from 'express';

@Middleware({ 
    requireAuth: true, 
    routes: [
        { 
            method: 'get', 
            path: '/v1/store/customers/me' }
    ] 
})
export class CustomerProfileMiddleware implements MedusaMiddleware {
    public consume(req: MedusaAuthenticatedRequest, res: Response, next: NextFunction): void | Promise<void> {
        return next();
    }
}