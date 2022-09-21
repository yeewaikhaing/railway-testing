import { Module } from 'medusa-extender';
import { CustomerProfileMiddleware } from './v1/middlewares/customerProfile.middleware';
import { CustomerRegisterMiddleware } from './v1/middlewares/customerRegister.middleware';
import { CustomerService } from './v1/services/customer.service';
import { CustomerRouter } from './v1/routers/customer.router';
import { CustomerRepository } from './v1/repositories/customer.repository';
import { CustomerV1Migration1663150921743 } from './v1/migrations/customer-v1.migration';
import { Customer } from './v1/entities/customer.entity';

@Module({
    imports: [
        Customer, 
        CustomerV1Migration1663150921743, 
        CustomerRepository, 
        CustomerRouter, 
        CustomerService, 
        CustomerRegisterMiddleware, 
        CustomerProfileMiddleware
    ]
})
export class CustomerModule {}