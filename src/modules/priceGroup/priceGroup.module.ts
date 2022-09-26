import { Module } from 'medusa-extender';
import { CreatePriceGroupMigration1664100391671 } from './migrations/create-priceGroup.migration';
import { PriceGroupService } from './priceGroup.service';
import { PriceGroupRouter } from './priceGroup.router';
import { PriceGroupRepository } from './priceGroup.repository';
import { PriceGroup } from './priceGroup.entity';

@Module({
    imports: [
        PriceGroup, 
        PriceGroupRepository, 
        PriceGroupRouter, 
        PriceGroupService, 
        CreatePriceGroupMigration1664100391671
    ]
})
export class PriceGroupModule {}