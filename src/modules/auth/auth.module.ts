import { Module } from 'medusa-extender';
//import { StorePostAuthReq } from './handlers/login-customer';
//import { StorePostAuthReq } from './handlers/customer-login';
//import { StorePostAuthReq } from './handlers/get-session';
import { AuthService } from './auth.service';
import { CustomerAuthRouter } from './auth-customer.router';
import { AuthRouter } from './auth-admin.router';

@Module({
    imports: [
        CustomerAuthRouter, 
        AuthService, 
        AuthRouter,
     ]
})
export class AuthModule {}