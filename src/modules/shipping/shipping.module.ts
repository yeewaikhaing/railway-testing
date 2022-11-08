import { Module } from 'medusa-extender';
import { AdminShippingRouter } from './routers/adminShipping.router';
import { ShippingProfileService } from './services/shippingProfile.service';
import { ShippingProfileRepository } from './repositories/shippingProfile.repository';
import { ShippingProfile } from './entities/shippingProfile.entity';
import { ShippingRouter } from './routers/shipping.router';
import { CustomShippingOption } from './entities/customShippingOption.entity';
import { CustomShippingOptionRepository } from './repositories/customShippingOption.repository';
import { CustomShippingOptionService } from './services/customShippingOption.service';
import { ShippingOptionService } from './services/shippingOption.service';
import { ShippingOptionRepository } from './repositories/shippingOption.repository';
import { ShippingOption } from './entities/shippingOption.entity';
import { ShippingMethodRepository } from './repositories/shippingMethod.repository';
import { ShippingMethod } from './entities/shippingMethod.entity';

@Module({
    imports: [
        ShippingMethod, 
        ShippingMethodRepository, 
        ShippingOption, 
        ShippingOptionRepository, 
        ShippingOptionService, 
        CustomShippingOptionService, 
        CustomShippingOptionRepository, 
        CustomShippingOption,
        ShippingRouter, ShippingProfile, 
        ShippingProfileRepository, 
        ShippingProfileService, 
        AdminShippingRouter
    ]
})
export class ShippingModule {}