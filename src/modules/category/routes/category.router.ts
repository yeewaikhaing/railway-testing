import { Router } from 'medusa-extender';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import { AdminPostCategoryReq } from '../handlers/create-category';
import createCategory from '../handlers/create-category';
import listCategory from '../handlers/list-category';
import { AdminGetCategoryParams } from '../handlers/list-category';
import getCategory from '../handlers/get-category';
import { Category } from '../entities/category.entity';
import updateCategory from '../handlers/update-category';
import { AdminPostCategoryCategoryReq } from '../handlers/update-category';

export const defaultAdminCategoryRelations = [
    "children",
    "parent",
  ]
  export const defaultAdminCategoryFields: (keyof Category)[] = [
    "id",
    "name",
    "is_disabled",
    "parent_id",
    "created_at",
    "updated_at",
    "deleted_at",
    
  ]

@Router({
    
    routes: [
        /**
         * Create a category
         */
        {
            requiredAuth: true,
            path: '/v1/admin/categories',
            method: 'post',
            handlers: [
                transformBody(AdminPostCategoryReq),
                middlewares.authenticate(), // authentication is required
                middlewares.wrap(createCategory)
            ],
        },
        /**
         * List categories
         */
        {
            requiredAuth: true,
            path: '/v1/admin/categories',
            method: 'get',
            handlers: [
                transformQuery(AdminGetCategoryParams, {
                    isList: true,
                    defaultRelations: defaultAdminCategoryRelations,
                    defaultFields: defaultAdminCategoryFields,
                    //allowedFields: allowedAdminProductFields,
                  }),
                middlewares.authenticate(), 
                middlewares.wrap(listCategory)
            ],
        },
        /**
         * Get a category
         */
        {
            requiredAuth: true,
            path: '/v1/admin/categories/:id',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(getCategory)
            ],
        },
        /**
         * Update a category
         */
        {
            requiredAuth: true,
            path: '/v1/admin/categories/:id',
            method: 'post',
            handlers: [
                transformBody(AdminPostCategoryCategoryReq),
                middlewares.authenticate(),
                middlewares.wrap(updateCategory)
            ],
        },
    ] 
})
export class CategoryRouter {}
