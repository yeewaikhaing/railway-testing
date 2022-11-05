import { Module } from 'medusa-extender';
import { FulfillmentService } from './services/fulfillment.service';
import { FulfillmentRepository } from './repositories/fulfillment.repository';
import { Fulfillment } from './entities/fulfillment.entity';

@Module({
    imports: [Fulfillment, FulfillmentRepository, FulfillmentService]
})
export class FulfillmentModule {}