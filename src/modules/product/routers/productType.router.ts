import {  Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import listProductTypes from '../handlers/productTypes/list-product-types';

export const allowedAdminProductTypeFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
  ]

  export const defaultAdminProductTypeFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
  ]

  export const defaultAdminProductTypeRelations = []

@Router({
    routes: 
    [
        /**
        * List Product Types
        */
        {
            requiredAuth: true,
            path: '/admin/v1/product-types',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listProductTypes),
            ],
        },
    ] 
})
export class ProductTypeRouter {}