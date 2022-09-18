import { Module } from 'medusa-extender';
import { VendorMigration1663150993315 } from './migrations/1663150993315-vendor.migration';
import { VendorRouter } from './routers/vendor.router';
import { VendorService } from './services/vendor.service';
import { VendorRepository } from './repositories/vendor.repository';

import { Vendor } from './entities/vendor.entity';

@Module({
    imports: [Vendor, VendorMigration1663150993315, VendorRepository, VendorService, VendorRouter, VendorMigration1663150993315]
})
export class VendorModule {}