import { Module } from 'medusa-extender';
import { FulfillmentProviderService } from './services/fulfillmentProvider.service';
import { FulfillmentProviderRepository } from './repositories/fulfillmentProvider.repository';
import { FulfillmentProvider } from './entities/fulfillmentProvider.entity';
import { FulfillmentService } from './services/fulfillment.service';
import { FulfillmentRepository } from './repositories/fulfillment.repository';
import { Fulfillment } from './entities/fulfillment.entity';

@Module({
    imports: [Fulfillment, FulfillmentRepository, FulfillmentService, FulfillmentProvider, FulfillmentProviderRepository, FulfillmentProviderService]
})
export class FulfillmentModule {}