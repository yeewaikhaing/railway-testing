import {  Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createPricingGroup from './handlers/create-pricing-group';
import getPricingGroup from './handlers/get-pricing-group';
import listPricingGroup from './handlers/list-pricing-group';
import updatePricingGroup from './handlers/update-pricing-group';

import { AdminGetPriceGroupParams } from './handlers/list-pricing-group';
import { AdminPostPriceGroupsPriceGroupReq } from './handlers/update-pricing-group';
import {AdminPostPriceGroupReq} from './handlers/create-pricing-group';

@Router({
    routes: [
        {
            requiredAuth: true,
            path: '/v1/admin/pricing-groups',
            method: 'post',
            handlers: [
                transformBody(AdminPostPriceGroupReq),
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(createPricingGroup)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/admin/pricing-groups/:id',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(getPricingGroup)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/admin/pricing-groups',
            method: 'get',
            handlers: [
                transformQuery(AdminGetPriceGroupParams, {
                    isList: true,
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
    ] 
})
export class PriceGroupRouter {}