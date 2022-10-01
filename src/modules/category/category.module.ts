import { Module } from 'medusa-extender';
import { CategoryMigration1664599257452 } from './migrations/create-category.migration';
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
        CategoryMigration1664599257452
    ]
})
export class CategoryModule {}