import {  Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import listProductTags from '../handlers/productTags/list-product-tags';

export const allowedAdminProductTagsFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
  ]
  
  export const defaultAdminProductTagsFields = [
    "id",
    "value",
    "created_at",
    "updated_at",
  ]
  export const defaultAdminProductTagsRelations = []
  
@Router({
    routes: 
    [
        /**
        * List Product Tag
        */
        {
            requiredAuth: true,
            path: '/admin/v1/product-tags',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listProductTags),
            ],
        },
    ] 
})
export class ProductTagRouter {}