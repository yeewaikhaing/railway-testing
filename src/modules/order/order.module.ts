import { Module } from 'medusa-extender';
import { Order } from './order.entity';
import { OrderMigration1661689658400 } from './1661689658400-order.migration';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';
//import { OrderSubscriber } from './order.subscriber';

@Module({
    imports: 
    [
        Order, 
        OrderRepository, 
        OrderService, 
        OrderMigration1661689658400, 
        
    ]
})
export class OrderModule {}