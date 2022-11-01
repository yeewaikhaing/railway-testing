import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Discount } from '../entities/discount.entity';
import createDiscount from '../handlers/create-discount';
@Router({
    routes: [
        /**
         * Create a discount
         */
         {
            requiredAuth: true,
            path: '/admin/v1/discounts',
            method: 'post',
            handlers: [
                
                middlewares.authenticate(), 
                middlewares.wrap(createDiscount)
            ],
        },
    ] 
})
export class DiscountRouter {}

export const defaultAdminDiscountsFields: (keyof Discount)[] = [
    "id",
    "code",
    "is_dynamic",
    "is_disabled",
    "rule_id",
    "parent_discount_id",
    "usage_limit",
    "usage_count",
    "starts_at",
    "ends_at",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
    "valid_duration",
  ]
  
  export const defaultAdminDiscountsRelations = [
    "rule",
    "parent_discount",
    "regions",
    "rule.conditions",
  ]
  