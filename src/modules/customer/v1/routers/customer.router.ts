import { MedusaAuthenticatedRequest, Router } from 'medusa-extender';
import { Response, NextFunction } from "express";
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import getCustomerHandler from '@medusajs/medusa/dist/api/routes/store/customers/get-customer'
import createCustomer from '../controllers/createCustomer';
import { Customer } from '../entities/customer.entity';
@Router({
    routes: [{
        requiredAuth: false,
        path: '/v1/store/customers',
        method: 'post',
        handlers: [
            createCustomer,
        ],
    },
    {
        requiredAuth: true,
        path: '/v1/store/customers/me',
        method: 'get',
        handlers: [
            wrapHandler(getCustomerHandler)
        ],
       
    }
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