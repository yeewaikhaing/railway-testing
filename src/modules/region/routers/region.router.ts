import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Region } from '../entities/region.entity';
import listRegion from '../handlers/list-region';
import getRegion from '../handlers/get-region';
import createRegion from '../handlers/create-region';
import addCountry from '../handlers/add-country';
import removeCountry from '../handlers/remove-country';
import getFulfillmentOptions from '../handlers/get-fulfillment-options';
import updateRegion from '../handlers/update-region';
import deleteRegion from '../handlers/delete-region';

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
        /**
         * Add a country to the country list of a region.
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id/countries',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(addCountry)
            ],
        },
        /**
         * Remove a country from the country list of a region.
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id/countries/:country_code',
            method: 'delete',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(removeCountry)
            ],
        },
        /**
         * List Fulfillment Options available to the region.
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id/fulfillment-options',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(getFulfillmentOptions)
            ],
        },
        /**
         * Update a region
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(updateRegion)
            ],
        },
        /**
         * Delete a region
         */
         {
            requiredAuth: true,
            path: '/admin/v1/regions/:region_id',
            method: 'delete',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(deleteRegion)
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

  export class FulfillmentOption {
    provider_id: string
    options: unknown[]
  }
  
  