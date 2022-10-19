import { Module } from 'medusa-extender';
import { AddDefaultCommissionToVendorMigration1666200511895 } from './migrations/addDefaultCommissionToVendor.migration';
import { VendorPaymentMigration2665246091359 } from './migrations/create-vendorPayment.migration';
import { VendorPaymentService } from './services/vendorPayment.service';
import { VendorPaymentRepository } from './repositories/vendorPayment.repository';
import { VendorPayment } from './entities/vendorPayment.entity';
import { VendorMigration2663150993315 } from './migrations/create-vendor.migration';
import { VendorRouter } from './routers/vendor.router';
import { VendorService } from './services/vendor.service';
import { VendorRepository } from './repositories/vendor.repository';

import { Vendor } from './entities/vendor.entity';

@Module({
    imports: [
        Vendor, 
        VendorMigration2663150993315, 
        VendorRepository, 
        VendorService, 
        VendorRouter, 
        VendorPayment, 
        VendorPaymentRepository, 
        VendorPaymentService, 
        VendorPaymentMigration2665246091359
    , AddDefaultCommissionToVendorMigration1666200511895]
})
export class VendorModule {}