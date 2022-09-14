import { MedusaAuthenticatedRequest, MedusaMiddleware } from 'medusa-extender';
import { NextFunction, Response } from 'express';
export declare class AttachInviteSubscriberMiddleware implements MedusaMiddleware {
    consume(req: MedusaAuthenticatedRequest, res: Response, next: NextFunction): Promise<void>;
}
