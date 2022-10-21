import {  Router } from 'medusa-extender';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { ProductVariant } from '@medusajs/medusa/dist/models/product-variant';
import listVariants from '../handlers/variants/list-variants';

export const defaultAdminVariantFields: (keyof ProductVariant)[] = [
    "id",
    "title",
    "product_id",
    "sku",
    "barcode",
    "ean",
    "upc",
    "inventory_quantity",
    "allow_backorder",
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
    "metadata",
  ]
 
  export const defaultAdminVariantRelations = [
      "product", 
      "prices", 
      "options"
    ]

    @Router({
        routes: 
        [
            /**
            * List Product Variants
            */
            {
                requiredAuth: true,
                path: '/admin/v1/variants',
                method: 'get',
                handlers: [
                    middlewares.authenticate(), 
                    middlewares.wrap(listVariants),
                ],
            },
        ] 
    })
export class ProductVariantRouter {}