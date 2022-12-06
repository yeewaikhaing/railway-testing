import {  Router } from 'medusa-extender';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createPricingGroup from './handlers/create-pricing-group';
import getPricingGroup from './handlers/get-pricing-group';
import listPricingGroup from './handlers/list-pricing-group';
import updatePricingGroup from './handlers/update-pricing-group';
import deletePricingGroup from './handlers/delete-pricing-group';
import { AdminGetPriceGroupParams } from './handlers/list-pricing-group';
import { AdminPostPriceGroupsPriceGroupReq } from './handlers/update-pricing-group';
import {AdminPostPriceGroupReq} from './handlers/create-pricing-group';

@Router({
    routes: [
        /**
         * Create a pricing group
         */
         {
            requiredAuth: true,
            path: '/admin/v1/pricing-groups',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(createPricingGroup)
            ],
        },
       /**
         * Get a pricing group
         */
        {
            requiredAuth: true,
            path: '/admin/v1/pricing-groups/:id',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(getPricingGroup)
            ],
        },
        /**
         * List  pricing groups
         */
        {
            requiredAuth: true,
            path: '/admin/v1/pricing-groups',
            method: 'get',
            handlers: [
                transformQuery(AdminGetPriceGroupParams, {
                    isList: true,
                    defaultRelations: ["areas"]
                  }),
                middlewares.authenticate(), 
                middlewares.wrap(listPricingGroup)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/admin/pricing-groups/:id',
            method: 'post',
            handlers: [
                transformBody(AdminPostPriceGroupsPriceGroupReq),
                middlewares.authenticate(),
                middlewares.wrap(updatePricingGroup)
            ],
        },
        /**
         * Delete a Price group
         */
        {
            requiredAuth: true,
            path: '/admin/v1/pricing-groups/:id',
            method: 'delete',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(deletePricingGroup)
            ],
        },
    ] 
})
export class PriceGroupRouter { }