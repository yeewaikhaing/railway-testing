import { Module } from 'medusa-extender';
import { RegionService } from './services/region.service';
import { RegionRouter } from './routers/region.router';
import { RegionRepository } from './repositories/region.repository';
import { Region } from './entities/region.entity';

@Module({
    imports: [Region, RegionRepository, RegionRouter, RegionService]
})
export class RegionModule {}