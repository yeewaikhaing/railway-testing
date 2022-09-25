import {  Router } from 'medusa-extender';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import middlewares from '@medusajs/medusa/dist/api/middlewares';
import { Customer } from '../entities/customer.entity';
import createCustomer from '../handlers/create-customer';
import getCustomer from '../handlers/get-customer';
import passwordResetToken from '../handlers/password-reset-token';
import resetPassword from '../handlers/reset-password';

@Router({
    routes: 
    [
        {
            requiredAuth: true,
            path: '/v1/store/customers',
            method: 'post',
            handlers: [
                wrapHandler(createCustomer)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/store/customers/me',
            method: 'get',
            handlers: [
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(getCustomer)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/store/customers/reset-password-token',
            method: 'post',
            handlers: [
                wrapHandler(passwordResetToken)
            ],
        },
        {
            requiredAuth: true,
            path: '/v1/store/customers/reset-password',
            method: 'post',
            handlers: [
                wrapHandler(resetPassword)
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
    "billing_address_id",
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

  export const defaultStoreCustomersRelations = [
    "shipping_addresses",
    "billing_address",
  ]