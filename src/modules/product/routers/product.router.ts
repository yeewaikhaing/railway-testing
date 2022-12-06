import {  Router } from 'medusa-extender';
import { Product } from '../entities/product.entity';
import middlewares, {
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import { FindParams, PaginatedResponse } from "@medusajs/medusa/dist/types/common";
import createProduct from '../handlers/products/create-product';
import getProduct from '../handlers/products/get-product';
import listProduct, { AdminGetProductsParams } from '../handlers/products/list-product';
import updateProduct from '../handlers/products/update-product';
import addOption from '../handlers/products/add-option';
import updateOption from '../handlers/products/update-option';
import deleteOption from '../handlers/products/delete-option';
import createVariant from '../handlers/products/create-variant';
import listVariant from '../handlers/products/list-variant';
import updateVariant from '../handlers/products/update-variant';
import deleteVariant from '../handlers/products/delete-variant';
import listType from '../handlers/products/list-type';
import deleteProduct from '../handlers/products/delete-product';
import listTagUsageCount from '../handlers/products/list-tag-usage-count';

export const defaultAdminGetProductsVariantsFields = [
  "id", 
  "product_id",
  "prices",
  "sku",
  "barcode",
  "ean",
  "upc",
  "variant_rank",
  "inventory_quantity",
  "allow_backorder",
  "manage_inventory",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
  "weight",
  "length",
  "height",
  "width",
]

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
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
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
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
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
         * List Product types
         */
        {
            requiredAuth: true,
            path: '/admin/v1/products/types',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listType),
            ],
        },
          /**
           * List Product Tag
          */
         {
              requiredAuth: true,
              path: '/admin/v1/products/tag-usage',
              method: 'get',
              handlers: [
                  middlewares.authenticate(), 
                  middlewares.wrap(listTagUsageCount),
              ],
          },
        /**
         * create a new product
         */
         {
            requiredAuth: true,
            path: '/admin/v1/products',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
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
    /**
     * Update a  product
     */
     {
        requiredAuth: true,
        path: '/admin/v1/products/:id',
        method: 'post',
        handlers: [
            middlewares.authenticate(), // authentication is required
            middlewares.wrap(updateProduct),
        ],
      },
      /**
      * Delete a  product
      */
      {
        requiredAuth: true,
        path: '/admin/v1/products/:id',
        method: 'delete',
        handlers: [
            middlewares.authenticate(),
            middlewares.wrap(deleteProduct),
        ],
      },
      /**
       * Add an option
       */
        {
          requiredAuth: true,
          path: '/admin/v1/products/:id/options',
          method: 'post',
          handlers: [
              middlewares.authenticate(), 
              middlewares.wrap(addOption),
          ],
        },
        /**
         * Update an option
         */
         {
          requiredAuth: true,
          path: '/admin/v1/products/:id/options/:option_id',
          method: 'post',
          handlers: [
              middlewares.authenticate(), 
              middlewares.wrap(updateOption),
          ],
        },
        /**
         * Delete an option
         */
        {
          requiredAuth: true,
          path: '/admin/v1/products/:id/options/:option_id',
          method: 'delete',
          handlers: [
              middlewares.authenticate(), 
              middlewares.wrap(deleteOption),
          ],
        },
        /**
         * Create a product variant
         */
        {
          requiredAuth: true,
          path: '/admin/v1/products/:id/variants',
          method: 'post',
          handlers: [
              middlewares.authenticate(), 
              middlewares.wrap(createVariant),
          ],
        },
        /**
         * List product variants by product id
         */
         {
            requiredAuth: true,
            path: '/admin/v1/products/:id/variants',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listVariant),
            ],
        },
        /**
         * Update a product variant
         */
         {
            requiredAuth: true,
            path: '/admin/v1/products/:id/variants/:variant_id',
            method: 'post',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(updateVariant),
            ],
        },
        /**
         * Delete a product variant
         */
         {
            requiredAuth: true,
            path: '/admin/v1/products/:id/variants/:variant_id',
            method: 'delete',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(deleteVariant),
            ],
        },
        
        
    ] 
})
export class ProductRouter {}


  