import {  Router } from 'medusa-extender';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createShippingOption from '../handlers/admin/create-shipping-option';
import { ShippingOption } from '../entities/shippingOption.entity';

@Router({
    routes: 
    [
        /**
         * Creates a Shipping Option
         */
         {
            requiredAuth: true,
            path: '/admin/v1/shipping-options',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(createShippingOption)
            ],
        },
    ] 
})
export class AdminShippingRouter {}

export const defaultFields: (keyof ShippingOption)[]= [
    "id",
    "name",
    "region_id",
    "profile_id",
    "provider_id",
    "price_type",
    "amount",
    "is_return",
    "admin_only",
    "data",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
  ]
  
  export const defaultRelations = ["region", "profile", "requirements"]