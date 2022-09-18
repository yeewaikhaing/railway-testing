import { Module } from 'medusa-extender';
import { CustomerService } from './services/customer.service';
import { CustomerRouter } from './routers/customer.router';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerPhase1Migration1663150921743 } from './migrations/customer-phase-1.migration';
import { Customer } from './entities/customer.entity';

@Module({
    imports: [
        Customer, 
        CustomerPhase1Migration1663150921743, 
        CustomerRepository, 
        CustomerRouter, 
        CustomerService
    ]
})
export class CustomerModule {}