import { Module } from 'medusa-extender';
import { AuthCustomerMiddleware } from './middlewares/authCustomer';
//import { StorePostAuthReq } from './controllers/loginCustomer';
import { AuthenticationRouter } from './routers/authentication.router';
import { AuthenticationService } from './services/authentication.service';

@Module({
    imports: [
        AuthenticationService, 
        AuthenticationRouter, 
        //StorePostAuthReq, 
        AuthCustomerMiddleware, 
    ]
})
export class AuthenticationModule {}