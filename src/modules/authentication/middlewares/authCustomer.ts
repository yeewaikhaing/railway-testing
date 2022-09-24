import { 
    Middleware,
    MedusaMiddleware,
    MedusaAuthenticatedRequest
} from 'medusa-extender';
import { NextFunction, Response } from 'express';

@Middleware(
    { 
        requireAuth: false, 
        routes: [
            { 
                method: 'post', 
                path: '/v1/store/auth' 
            }
        ] 
    }
)
export class AuthCustomerMiddleware implements MedusaMiddleware {
    public consume(req: MedusaAuthenticatedRequest, res: Response, next: NextFunction): void | Promise<void> {
        return next();
    }
}