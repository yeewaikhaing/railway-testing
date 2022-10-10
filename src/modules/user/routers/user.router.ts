import { Router } from 'medusa-extender';
import createUserHandler from '@medusajs/medusa/dist/api/routes/admin/users/create-user';
import wrapHandler from '@medusajs/medusa/dist/api/middlewares/await-middleware';
import createUser from '../handlers/create-user';
import getUser from '../handlers/get-user';
import listUser, { AdminGetUsersParams } from '../handlers/list-user';
import { User } from '../entities/user.entity';
import  updateUser, { AdminUpdateUserRequest }  from '../handlers/update-user';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import { EmptyQueryParams } from '@medusajs/medusa/dist/types/common';
import deleteUser from '../handlers/delete-user';

  export const defaultAdminUsersFields: (keyof User)[] = [
    "id",
    "email",
    "phone",
    "user_name",
    "first_name",
    "last_name",
    "custom_role",
    "email_verified_at",
    "phone_verified_at",
    "store_id",
    "created_at",
    "updated_at",
    "deleted_at",
    "metadata",
    "store",
    "vendor",
  ]

  export const defaultAdminUsersRelations = [
    "store",
    //"vendor"
  ]

@Router({
    routes: 
        [
            /**
             * create a user
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users',
                method: 'post',
                handlers: [
                    middlewares.authenticate(), // authentication is required
                    middlewares.wrap(createUser),
                ],
            },
            /**
             * update a user
             */
             {
                requiredAuth: true,
                path: '/admin/v1/users/:user_id',
                method: 'post',
                handlers: [
                    transformBody(AdminUpdateUserRequest),
                    middlewares.authenticate(), // authentication is required
                    middlewares.wrap(updateUser),
                ],
            },
            /**
             * delete a user
             */
             {
              requiredAuth: true,
              path: '/admin/v1/users/:user_id',
              method: 'delete',
              handlers: [
                  middlewares.authenticate(),
                  middlewares.wrap(deleteUser),
              ],
          },
            /**
             * Get a User
             */
            {
                requiredAuth: true,
                path: '/admin/v1/users/:user_id',
                method: 'get',
                handlers: [
                    middlewares.authenticate(), // authentication is required
                    transformQuery(EmptyQueryParams, {
                        defaultRelations: defaultAdminUsersRelations,
                        defaultFields: defaultAdminUsersFields,
                        allowedFields: defaultAdminUsersFields,
                        isList: false
                      }),
                    middlewares.wrap(getUser)
                ],
            },
            /**
             * List  Users
             */
             {
                requiredAuth: true,
                path: '/admin/v1/users',
                method: 'get',
                handlers: [
                    transformQuery(AdminGetUsersParams, {
                        defaultRelations: defaultAdminUsersRelations,
                        defaultFields: defaultAdminUsersFields,
                        allowedFields: defaultAdminUsersFields,
                        isList: true
                      }),
                    middlewares.authenticate(), 
                    middlewares.wrap(listUser)
                ],
            },
            // {
            //     requiredAuth: true,
            //     //path: '/admin/create-user',
            //     path: '/admin/v1/users',
            //     method: 'post',
            //     handlers: [wrapHandler(createUserHandler)],
            // },
        ],
})
export class UserRouter {}
