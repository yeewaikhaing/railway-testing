import { Module } from 'medusa-extender';
//import { StorePostAuthReq } from './handlers/get-session';
import { AuthService } from './auth.service';
import { AuthRouter } from './auth.router';

@Module({
    imports: [
        AuthRouter, 
        AuthService, 
       // StorePostAuthReq
    ]
})
export class AuthModule {}