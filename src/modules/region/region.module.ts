import { Module } from 'medusa-extender';
import { CountryRepository } from './repositories/country.repository';
import { Country } from './entities/country.entity';
import { RegionService } from './services/region.service';
import { RegionRouter } from './routers/region.router';
import { RegionRepository } from './repositories/region.repository';
import { Region } from './entities/region.entity';

@Module({
    imports: [
        Region, 
        RegionRepository, 
        RegionRouter, 
        RegionService, 
        Country, 
        CountryRepository
    ]
})
export class RegionModule {}