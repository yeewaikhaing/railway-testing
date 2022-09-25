import {  Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createPricingGroup from './handlers/create-pricing-group';
import {AdminPostPriceGroupReq} from './handlers/create-pricing-group';

@Router({
    routes: [{
        requiredAuth: true,
        path: '/v1/admin/pricing-groups',
        method: 'post',
        handlers: [
            // middlewares.authenticate(), // authentication is required
            // transformBody(AdminPostPriceGroupReq),
            // middlewares.wrap(createPricingGroup)
        ],
    }] 
})
export class PriceGroupRouter {}