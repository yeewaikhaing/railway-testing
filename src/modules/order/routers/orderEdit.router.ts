import { Router } from 'medusa-extender';
import middlewares,{
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import getOrderEdit from '../handlers/storefront/get-order-edit';
import { FindParams } from '@medusajs/medusa/dist/types/common';
import {
    defaultStoreOrderEditRelations,
    defaultStoreOrderEditFields
} from "../types/order-edit"

@Router({
    routes: 
    [
        /**
         * Retrieves a OrderEdit by order edit Id
         */
         {
            requiredAuth: false,
            path: '/store/v1/order-edits/:id',
            method: 'get',
            handlers: [
                transformQuery(FindParams, {
                    defaultRelations: defaultStoreOrderEditRelations,
                    defaultFields: defaultStoreOrderEditFields,
                    allowedFields: defaultStoreOrderEditFields,
                    isList: false,
                  }),
                middlewares.wrap(getOrderEdit)
            ],
        },
    ] 
})
export class OrderEditRouter {}