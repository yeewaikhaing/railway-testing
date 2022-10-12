import { Module } from 'medusa-extender';
import { CreateAreaMigration1665556631750 } from './migrations/createArea.migration';
import { DeliveryAreaService } from './services/deliveryArea.service';
import { CityService } from './services/city.service';
import { AreaRouter } from './routers/area.router';
import { DeliveryAreaRepository } from './repositories/deliveryArea.repository';
import { CityRepository } from './repositories/city.repository';
import { CreateCityMigration1665535795090 } from './migrations/createCity.migration';
import { DeliveryArea } from './entities/deliveryArea.entity';
import { City } from './entities/city.entity';
@Module({
    imports: [
        DeliveryArea, 
        City,
        CreateCityMigration1665535795090,
        DeliveryAreaRepository, 
        CityRepository,
        AreaRouter, 
        DeliveryAreaService,
        CityService, 
        CreateAreaMigration1665556631750
    ]
})
export class DeliveryAreaModule {}