import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Region } from '../entities/region.entity';
import listRegion from '../handlers/list-region';
import getRegion from '../handlers/get-region';
import createRegion from '../handlers/create-region';

@Router({
    routes: 
    [
        /**
         * List regions
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listRegion)
            ],
        },
        /**
         * Get a region
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(getRegion)
            ],
        }, 
        /**
         * Create a region
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(createRegion)
            ],
        },
    ] 
})
export class RegionRouter {}

export const defaultAdminRegionFields: (keyof Region)[] = [
    "id",
    "name",
    "automatic_taxes",
    "gift_cards_taxable",
    "tax_provider_id",
    "currency_code",
    "tax_rate",
    "tax_code",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
  ]
  
  export const defaultAdminRegionRelations = [
    "countries",
    "payment_providers",
    "fulfillment_providers",
  ]
  