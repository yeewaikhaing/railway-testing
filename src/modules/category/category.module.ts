import { Module } from 'medusa-extender';
import { CategoryClosureMigration1664770918211 } from './migrations/create-categoryClosure.migration';
//import { AdminPostCategoryCategoryReq } from './handlers/update-category';
//import { AdminGetCategoryParams } from './handlers/list-category';
import { CategoryMigration1664599257459 } from './migrations/create-category.migration';
import { CategoryService } from './services/category.service';
import { CategoryRouter } from './routes/category.router';
import { CategoryRepository } from './repositories/category.repository';
import { Category } from './entities/category.entity';

@Module({
    imports: [
        Category, 
        CategoryRepository, 
        CategoryRouter, 
        CategoryService, 
       CategoryMigration1664599257459,
       //AdminGetCategoryParams, 
      // AdminPostCategoryCategoryReq,
       CategoryClosureMigration1664770918211
    ]
})
export class CategoryModule {}