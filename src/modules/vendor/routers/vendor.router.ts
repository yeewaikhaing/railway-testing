import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import { UserService } from "@medusajs/medusa/dist/services";
import { Response, NextFunction } from "express";
import { User } from "@medusajs/medusa/dist";
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import createVendor from '../handlers/create-vendor';
import listVendor from '../handlers/list-vendor';
import getVendor from '../handlers/get-vendor';
import { AdminGetUsersParams } from '../../user/handlers/list-user';
import { defaultAdminUsersFields, defaultAdminUsersRelations } from '../../user/routers/user.router';
import { EmptyQueryParams } from '@medusajs/medusa/dist/types/common';

export const defaultAdminVendorRelations = [
  "user",
  "user.store",
  "payments"
]

// export const defaultAdminVendorFields: (keyof Vendor)[] = [
//   "id",
//   "user",
//   "nrcno",
//   "primary_phone",
//   "secondary_phone",
//   "user",
//   "created_at",
//   "updated_at",
//   "deleted_at",
// ]


@Router({
    routes: 
    [
        /**
         * create a vendor
         */
         {
            requiredAuth: true,
            path: '/admin/v1/vendors',
            method: 'post',
            handlers: [
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(createVendor),
            ],
        },
          /**
           * List  Users
           */
          {
            requiredAuth: true,
            path: '/admin/v1/vendors',
            method: 'get',
            handlers: [
                transformQuery(AdminGetUsersParams, {
                    defaultRelations: defaultAdminUsersRelations,
                    defaultFields: defaultAdminUsersFields,
                    allowedFields: defaultAdminUsersFields,
                    isList: true
                  }),
                middlewares.authenticate(), 
                middlewares.wrap(listVendor)
            ],
        },
        /**
         * Get a User
         */
         {
          requiredAuth: true,
          path: '/admin/v1/vendors/:vendor_id',
          method: 'get',
          handlers: [
              middlewares.authenticate(), // authentication is required
              transformQuery(EmptyQueryParams, {
                  defaultRelations: defaultAdminVendorRelations,
                  isList: false
                }),
              middlewares.wrap(getVendor)
          ],
      },
    ] 
})
export class VendorRouter {}

