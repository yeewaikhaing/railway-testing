import { Module } from 'medusa-extender';
import { StorefrontOrderRouter } from './routers/storefrontOrder.router';
import { AdminOrderRouter } from './routers/adminOrder.router';
import { Order } from './entities/order.entity';
import { OrderMigration1661689658400 } from './migrations/1661689658400-order.migration';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
//import { OrderSubscriber } from './order.subscriber';

@Module({
    imports: 
    [
        Order, 
        OrderRepository, 
        OrderService, 
        OrderMigration1661689658400, 
        StorefrontOrderRouter,
        AdminOrderRouter,
    ]
})
export class OrderModule {}