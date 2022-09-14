import { Module } from 'medusa-extender';
import { CustomerService } from './services/customer.service';
import { CustomerRouter } from './routers/customer.router';
import { CustomerRepository } from './repositories/customer.repository';
import { CustomerMigration1663150921743 } from './migrations/1663150921743-customer.migration';
import { Customer } from './entities/customer.entity';

@Module({
    imports: [Customer, CustomerMigration1663150921743, CustomerRepository, CustomerRouter, CustomerService]
})
export class CustomerModule {}