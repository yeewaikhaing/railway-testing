import {  Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Customer } from '../entities/customer.entity';
import createCustomer from '../handlers/create-customer';
import getCustomer from '../handlers/get-customer';
import passwordResetToken from '../handlers/password-reset-token';
import resetPassword from '../handlers/reset-password';
import createAddress from '../handlers/create-address';
import deleteAddress from '../handlers/delete-address';
import updateAddress from '../handlers/update-address';

@Router({
    routes: 
    [   
         /**
         * Register a customer
         */
        {
            requiredAuth: true,
            path: '/store/v1/customers',
            method: 'post',
            handlers: [
                wrapHandler(createCustomer)
            ],
        },
         /**
         * Get a Customer
         */
        {
            requiredAuth: true,
            path: '/store/v1/customers/me',
            method: 'get',
            handlers: [
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(getCustomer)
            ],
        },
         /**
         * Request a reset password token
         */
        {
            requiredAuth: true,
            path: '/store/v1/customers/reset-password-token',
            method: 'post',
            handlers: [
                wrapHandler(passwordResetToken)
            ],
        },
         /**
         * Reset password
         */
        {
            requiredAuth: true,
            path: '/store/v1/customers/reset-password',
            method: 'post',
            handlers: [
                wrapHandler(resetPassword)
            ],
        },
        /**
         * Create an address
         */
         {
            requiredAuth: true,
            path: '/store/v1/customers/me/addresses',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(createAddress)
            ],
        },
         /**
         * Delete an address
         */
          {
            requiredAuth: true,
            path: '/store/v1/customers/me/addresses/:address_id',
            method: 'delete',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(deleteAddress)
            ],
        }, 
        /**
         * Update an address
         */
         {
            requiredAuth: true,
            path: '/store/v1/customers/me/addresses/:address_id',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(updateAddress)
            ],
        },
    ] 
})
export class CustomerRouter {}

export const defaultStoreCustomersFields: (keyof Customer)[] = [
    "id",
    "email",
    "first_name",
    "last_name",
    //"billing_address_id",
    "phone",
    "user_name",
    "email_verified_at",
    "phone_verified_at",
    "has_account",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
    "status",
    "join_date"
  ]

//   export const defaultStoreCustomersRelations = [
//     "shipping_addresses",
//     "billing_address",
//   ]
export const defaultStoreCustomersRelations = [
    "addresses",
    "addresses.delivery_area",
    "addresses.delivery_area.priceGroup"
]