import { Module } from 'medusa-extender';
import { ProductVariantRouter } from './routers/productVariant.router';
import { ProductTypeRouter } from './routers/productType.router';
//import { ProductSubscriber } from './subscribers/product.subscriber';
import { ProductTagRouter } from './routers/productTag.router';
import { CreateProductCategoryMigration1665823147868 } from './migrations/createProductCategory.migration';
import { Product } from './entities/product.entity';
import {ProductRepository} from './repositories/product.repository';
import { ProductRouter } from './routers/product.router';
import { ProductService } from './services/product.service';
import { PricingService } from './services/pricing.service';
import { ProductVariantService } from './services/productVariant.service';
import addStoreIdToProduct1645034402086 from './migrations/product.migration';
import AttachProductSubscribersMiddleware from './middlewares/product.middleware';
import { AddCommisionToProductMigration1666119864595 } from './migrations/addCommisionToProduct.migration';
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
      AddCommisionToProductMigration1666119864595,
     CreateProductCategoryMigration1665823147868, 
     ProductTagRouter, 
     //ProductSubscriber, 
     ProductTypeRouter,
     ProductVariantRouter,
    ]
})
export class ProductModule {}