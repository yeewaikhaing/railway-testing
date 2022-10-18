import {  Router } from 'medusa-extender';
import { Product } from '../entities/product.entity';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createProduct from '../handlers/products/create-product';
@Router({
    routes: 
    [
        /**
         * create a new product
         */
         {
            requiredAuth: true,
            path: '/admin/v1/products',
            method: 'post',
            handlers: [
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(createProduct),
            ],
        },
    ] 
})
export class ProductRouter {}

export const defaultAdminProductRelations = [
    "variants",
    "variants.prices",
    "variants.options",
    "images",
    "options",
    "tags",
    "type",
    "collection",
    "store",
    "categories"
  ]

export const defaultAdminProductFields: (keyof Product)[] = [
    "id",
    "title",
    "subtitle",
    "status",
    "external_id",
    "description",
    "handle",
   "is_giftcard",
    "discountable",
    "thumbnail",
    "profile_id",
    "collection_id",
    "type_id",
    "weight",
    "length",
    "height",
    "width",
    // "hs_code",
    // "origin_country",
    // "mid_code",
    // "material",
    "created_at",
    "updated_at",
    "deleted_at",
    "store_id"
  ]
  