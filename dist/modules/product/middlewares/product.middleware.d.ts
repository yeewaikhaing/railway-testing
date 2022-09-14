import { MedusaAuthenticatedRequest, MedusaMiddleware } from 'medusa-extender';
import { NextFunction, Request, Response } from 'express';
export default class AttachProductSubscribersMiddleware implements MedusaMiddleware {
    consume(req: MedusaAuthenticatedRequest | Request, res: Response, next: NextFunction): void | Promise<void>;
}
