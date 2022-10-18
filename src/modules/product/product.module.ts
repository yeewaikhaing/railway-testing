import { Module } from 'medusa-extender';
import { Product } from './entities/product.entity';
import {ProductRepository} from './repositories/product.repository';
import { ProductRouter } from './routers/product.router';
import { ProductService } from './services/product.service';
import { PricingService } from './services/pricing.service';
import { ProductVariantService } from './services/productVariant.service';
import addStoreIdToProduct1645034402086 from './migrations/product.migration';
import AttachProductSubscribersMiddleware from './middlewares/product.middleware';

@Module({
    imports: [
      Product,
      ProductRouter,
      ProductRepository,
      ProductService,
      PricingService,
      ProductVariantService,
      addStoreIdToProduct1645034402086,
      AttachProductSubscribersMiddleware,
    ]
})
export class ProductModule {}