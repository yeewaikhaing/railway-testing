import {  Router } from 'medusa-extender';
import middlewares, {
    transformBody,
    transformQuery,
  } from '@medusajs/medusa/dist/api/middlewares';
import { EmptyQueryParams } from '@medusajs/medusa/dist/types/common';
import seedData from '../handlers/seed-data';
import createCity from '../handlers/create-city';
import getCity from '../handlers/get-city';
import listLocation from '../handlers/list-location';
import getLocation from '../handlers/get-location';
import { City } from '../entities/city.entity';

export const defaultAdminCityRelations = [
    "areas"
  ]
 //select properties
 export const defaultAdminCityFields: (keyof City)[] = [
    "id",
    "city_name",
    "areas",
    "created_at",
    "deleted_at",
    "updated_at"
  ] 
@Router({
    routes: 
    [
        /**
         * Seed city and its related areas
         */
         {
            requiredAuth: true,
            path: '/admin/v1/seed-locations',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(seedData),
            ],
        },
        /**
         * Create a city and its related areas
         */
         {
            requiredAuth: true,
            path: '/admin/v1/cities',
            method: 'post',
            handlers: [
                middlewares.authenticate(),
                middlewares.wrap(createCity),
            ],
        },
        
        /**
           * List  Locations (city + un-pricing areas)
           */
         {
            requiredAuth: true,
            path: '/admin/v1/cities/locations',
            method: 'get',
            handlers: [
                middlewares.authenticate(), 
                middlewares.wrap(listLocation)
            ],
        },
        /**
        * Get  un-pricing locations of the given city id
        */
         {
          requiredAuth: true,
          path: '/admin/v1/cities/:id/locations',
          method: 'get',
          handlers: [
              middlewares.authenticate(), 
              transformQuery(EmptyQueryParams, {
                defaultRelations: defaultAdminCityRelations,
                isList: false
              }),
              middlewares.wrap(getLocation)
          ],
      },
        /**
         * Get a City and its related all areas
         */
         {
          requiredAuth: true,
          path: '/admin/v1/cities/:id',
          method: 'get',
          handlers: [
              middlewares.authenticate(),
              transformQuery(EmptyQueryParams, {
                  defaultRelations: defaultAdminCityRelations,
                  isList: false
                }),
              middlewares.wrap(getCity)
          ],
      },
    ] 
})
export class AreaRouter {}