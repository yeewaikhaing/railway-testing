import { MedusaAuthenticatedRequest, MedusaMiddleware, Middleware } from 'medusa-extender';
import { NextFunction, Response, Request } from 'express';

import {UserService} from '../services/user.service';

//@Middleware({ requireAuth: true, routes: [{ method: "all", path: '*' }] })
@Middleware(
    { 
        requireAuth: true, 
        routes: 
        [
            { 
                method: "all", 
                path: '/admin/*'
            }
        ] 
    })
export class LoggedInUserMiddleware implements MedusaMiddleware {
    
    // public async consume(req: MedusaAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    //     const userService = req.scope.resolve('userService') as UserService;
        
    //     const loggedInUser = await userService.retrieve(req.user.userId, {
    //         select: ['id', 'store_id']
    //     });
    //     req.scope.register({
    //         loggedInUser: {
    //             resolve: () => loggedInUser,
    //         },
    //     });
    //     next();
    // }
     public async consume(req: MedusaAuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
        let loggedInUser = null;
        //console.log("loggedInUser........", req.user);
        
        if (req.user && req.user.userId && /^\/admin/.test(req.originalUrl)) {
            const userService = req.scope.resolve('userService') as UserService;
            loggedInUser = await userService.retrieve(req.user.userId, {
                select: ['id', 'store_id'],
            });
        }
        req.scope.register({
            loggedInUser: {
                resolve: () => loggedInUser,
            },
        });
       // console.log("loggedin user in middleware ", loggedInUser);
        
        next();
    }
}