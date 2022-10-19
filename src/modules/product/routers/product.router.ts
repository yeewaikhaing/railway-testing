import {  Router } from 'medusa-extender';
import { Product } from '../entities/product.entity';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
  import { FindParams, PaginatedResponse } from "@medusajs/medusa/dist/types/common";
import createProduct from '../handlers/products/create-product';
import getProduct from '../handlers/products/get-product';
import listProduct, { AdminGetProductsParams } from '../handlers/products/list-product';

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
  "store_id",
  "store",
  "commission",
]

export const allowedAdminProductFields = [
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
  "store_id",
  "store",
  "commission"
]

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
        /**
         * Get a product
         */
         {
          requiredAuth: true,
          path: '/admin/v1/products/:id',
          method: 'get',
          handlers: [
            transformQuery(FindParams, {
              defaultRelations: defaultAdminProductRelations,
              defaultFields: defaultAdminProductFields,
              allowedFields: allowedAdminProductFields,
              isList: false,
            }),
              middlewares.authenticate(), // authentication is required
              middlewares.wrap(getProduct),
          ],
      },
      /**
         * List products
         */
       {
        requiredAuth: true,
        path: '/admin/v1/products',
        method: 'get',
        handlers: [
          transformQuery(AdminGetProductsParams, {
            defaultRelations: defaultAdminProductRelations,
            defaultFields: defaultAdminProductFields,
            allowedFields: allowedAdminProductFields,
            isList: true,
          }),
            middlewares.authenticate(),
            middlewares.wrap(listProduct),
        ],
    },
    ] 
})
export class ProductRouter {}


  