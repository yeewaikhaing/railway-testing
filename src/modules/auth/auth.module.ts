import { Module } from 'medusa-extender';
//import { StorePostAuthReq } from './handlers/customer-login';
//import { StorePostAuthReq } from './handlers/get-session';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';

@Module({
    imports: [
        AuthRouter, 
        AuthService, 
     ]
})
export class AuthModule {}