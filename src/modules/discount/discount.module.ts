import { Module } from 'medusa-extender';
import { DiscountConditionService } from './services/discountCondition.service';
import { DiscountConditionProduct } from './entities/discountConditionProduct.entity';
import { DiscountRuleService } from './services/discountRule.service';
import { DiscountRuleRepository } from './repositories/discountRule.repository';
import { DiscountConditionRepository } from './repositories/discountCondition.repository';
//import { AdminPostDiscountsDiscountReq } from './handlers/update-discount';
//import { AdminPostDiscountsReq } from './handlers/create-discount';
import { DiscountCondition } from './entities/discountCondition.entity';
import { DiscountRule } from './entities/discountRule.entity';
import { DiscountService } from './services/discount.service';
import { DiscountRouter } from './routers/discount.router';
import { DiscountRepository } from './repositories/discount.repository';
import { Discount } from './entities/discount.entity';

@Module({
    imports: [
        Discount, 
        DiscountRepository, 
        DiscountRouter, 
        DiscountService, 
        DiscountRule, 
        DiscountCondition,
        DiscountConditionRepository, 
        DiscountRuleRepository,
        DiscountRuleService, 
        DiscountConditionProduct, 
        DiscountConditionService]
})
export class DiscountModule {}