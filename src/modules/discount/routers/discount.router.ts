import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Discount } from '../entities/discount.entity';
import { DiscountCondition } from '../entities/discountCondition.entity';
import createDiscount from '../handlers/create-discount';
import getDiscount from '../handlers/get-discount';
import createCondition from '../handlers/create-condition';
import getCondition from '../handlers/get-condition';
import updateCondition from '../handlers/update-condition';
import deleteCondition from '../handlers/delete-condition';

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
        /**
         * Get a discount
         */
         {
            requiredAuth: true,
            path: '/admin/v1/discounts/:discount_id',
            method: 'get',
            handlers: [
                
                middlewares.authenticate(), 
                middlewares.wrap(getDiscount)
            ],
        },
        /**
         * Create a discount condition
         */
         {
            requiredAuth: true,
            path: '/admin/v1/discounts/:discount_id/conditions',
            method: 'post',
            handlers: [
                
                middlewares.authenticate(), 
                middlewares.wrap(createCondition)
            ],
        },
        /**
         * Get a discount condition
         */
         {
            requiredAuth: true,
            path: '/admin/v1/discounts/:discount_id/conditions/:condition_id',
            method: 'get',
            handlers: [
                
                middlewares.authenticate(), 
                middlewares.wrap(getCondition)
            ],
        },
        /**
         * Update a discount condition
         */
        //  {
        //     requiredAuth: true,
        //     path: '/admin/v1/discounts/:discount_id/conditions/:condition_id',
        //     method: 'post',
        //     handlers: [
                
        //         middlewares.authenticate(), 
        //         middlewares.wrap(updateCondition)
        //     ],
        // },
        /**
         * Delete a discount condition
         */
         {
            requiredAuth: true,
            path: '/admin/v1/discounts/:discount_id/conditions/:condition_id',
            method: 'delete',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(deleteCondition)
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

  export const defaultAdminDiscountConditionFields: (keyof DiscountCondition)[] =
  ["id", "type", "operator", "discount_rule_id", "created_at", "updated_at"]

export const defaultAdminDiscountConditionRelations = ["discount_rule"]
  