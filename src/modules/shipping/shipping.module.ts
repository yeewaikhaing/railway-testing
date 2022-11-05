import { Module } from 'medusa-extender';
import { ShippingOptionService } from './services/shippingOption.service';
import { ShippingOptionRepository } from './repositories/shippingOption.repository';
import { ShippingOption } from './entities/shippingOption.entity';
import { ShippingMethodRepository } from './repositories/shippingMethod.repository';
import { ShippingMethod } from './entities/shippingMethod.entity';

@Module({
    imports: [ShippingMethod, ShippingMethodRepository, ShippingOption, ShippingOptionRepository, ShippingOptionService]
})
export class ShippingModule {}