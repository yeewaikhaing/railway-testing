import { Module } from 'medusa-extender';
import { VendorPaymentMigration1665246091359 } from './migrations/1665246091359-vendorPayment.migration';
import { VendorPaymentService } from './services/vendorPayment.service';
import { VendorPaymentRepository } from './repositories/vendorPayment.repository';
import { VendorPayment } from './entities/vendorPayment.entity';
import { VendorMigration1663150993315 } from './migrations/1663150993315-vendor.migration';
import { VendorRouter } from './routers/vendor.router';
import { VendorService } from './services/vendor.service';
import { VendorRepository } from './repositories/vendor.repository';

import { Vendor } from './entities/vendor.entity';

@Module({
    imports: [
        Vendor, 
        VendorMigration1663150993315, 
        VendorRepository, 
        VendorService, 
        VendorRouter, 
        VendorPayment, 
        VendorPaymentRepository, 
        VendorPaymentService, 
        VendorPaymentMigration1665246091359
    ]
})
export class VendorModule {}