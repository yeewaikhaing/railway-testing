import { Module } from 'medusa-extender';
import { DiscountService } from './services/discount.service';
import { DiscountRouter } from './routers/discount.router';
import { DiscountRepository } from './repositories/discount.repository';
import { Discount } from './entities/discount.entity';

@Module({
    imports: [Discount, DiscountRepository, DiscountRouter, DiscountService]
})
export class DiscountModule {}