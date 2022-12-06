import { Module } from 'medusa-extender';
import { OrderEditRouter } from './routers/orderEdit.router';
import { OrderEdit } from './entities/orderEdit.entity';
import { OrderEditRepository } from './repositories/orderEdit.repository';
import { OrderEditService } from './services/orderEdit.service';
import { StorefrontOrderRouter } from './routers/storefrontOrder.router';
import { AdminOrderRouter } from './routers/adminOrder.router';
import { Order } from './entities/order.entity';
import { OrderMigration1661689658400 } from './migrations/1661689658400-order.migration';
import { OrderRepository } from './repositories/order.repository';
import { OrderService } from './services/order.service';
import { OrderSubscriber } from './order.subscriber';

@Module({
    imports: 
    [
        Order, 
        OrderRepository, 
        OrderService, 
        OrderMigration1661689658400, 
        StorefrontOrderRouter,
        AdminOrderRouter,
        OrderEditRouter,
        OrderEdit,
        OrderEditRepository,
        OrderEditService,
        OrderSubscriber
    ]
})
export class OrderModule {}