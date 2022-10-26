import {  Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import listProduct from '../handlers/store/list-product';
import getProduct from '../handlers/store/get-product';
import searchProduct from '../handlers/store/search-product';
import listProductVariant from '../handlers/store/list-product-variant';
import getProductVariant from '../handlers/store/get-product-variant';
@Router({
    routes: [
        /**
         * List Product
         */
         {
            requiredAuth: false,
            path: '/store/v1/products',
            method: 'get',
            handlers: [
                wrapHandler(listProduct)
            ],
        }, 
        /**
         * Search Product
         */
         {
            requiredAuth: false,
            path: '/store/v1/products/search',
            method: 'get',
            handlers: [
                wrapHandler(searchProduct)
            ],
        },
        /**
         * Get a Product
         */
         {
            requiredAuth: false,
            path: '/store/v1/products/:id',
            method: 'get',
            handlers: [
                wrapHandler(getProduct)
            ],
        },
        /**
         * List Variants
         */
         {
            requiredAuth: false,
            path: '/store/v1/variants',
            method: 'get',
            handlers: [
                wrapHandler(listProductVariant)
            ],
        }, 
        /**
         * Get a Variant
         */
         {
            requiredAuth: false,
            path: '/store/v1/variants/:variant_id',
            method: 'get',
            handlers: [
                wrapHandler(getProductVariant)
            ],
        },
        
    ] 
})
export class StorefrontProductRouter {}

export const defaultStoreProductsRelations = [
    "variants",
    "variants.prices",
    "variants.options",
    "options",
    "options.values",
    "images",
    "tags",
    "collection",
    "type",
    "categories"
  ]
  export const defaultStoreVariantRelations = ["prices", "options"]