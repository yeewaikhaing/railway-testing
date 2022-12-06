/**
 * @oas [post] /admin/v1/seed-locations
 * description: "Creates cities and its associated areas"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - cities
 *         properties:

 *           cities:
 *             description: The city array.
 *             type: array
 *             items:
 *                required:
 *                   - id
 *                   - city_name
 *                   - areas
    *             properties:
    *               id:
    *                 description: The id of the City.
    *                 type: string
    *               city_name:
    *                 description: The name of the City.
    *                 type: string
    *               areas:
    *                 description: The area[] associated with the city.
    *                 type: array
    *                 items:
    *                    required:
    *                      - id
    *                      - area_name
    *                      - city_id
    *                    properties:
    *                      id: 
    *                          description: The id of the Area.
    *                          type: string
    *                      area_name:
    *                          description: The name of the area.
    *                          type: string
    *                      city_id:
    *                        description: The id of the City.
    *                        type: string
 
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
    "cities": [
        {
            "id": "1",
            "city_name": "Yangon",
            "areas": [
                {
                    "id": "1",
                    "area_name": "Hlaing",
                    "city_id": "1"
                },
                {
                    "id": "2",
                    "area_name": "Hledan",
                    "city_id": "1"
                }
            ]
        },
        {
            "id": "2",
            "city_name": "Mandalay",
            "areas": [
                {
                    "id": "6",
                    "area_name": "Mahar Aung Myay",
                    "city_id": "2"
                }
            ]
        }
      ]
}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Vendor
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/City"
 *   "400":
 *     $ref: "#/components/responses/400_error"
 *   "401":
 *     $ref: "#/components/responses/unauthorized"
 *   "404":
 *     $ref: "#/components/responses/not_found_error"
 *   "409":
 *     $ref: "#/components/responses/invalid_state_error"
 *   "422":
 *     $ref: "#/components/responses/invalid_request_error"
 *   "500":
 *     $ref: "#/components/responses/500_error"
 */
import {
    IsArray,
    ValidateNested,
  } from "class-validator"
import { MedusaError } from "medusa-core-utils";
import { Type } from "class-transformer"
import { EntityManager } from "typeorm";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { core_response } from "../../app/coreResponse";
import { CityService } from "../services/city.service";
import { CreateCityInput } from "../types/city";
import { City } from "../entities/city.entity";
import { AdminPostCityReq } from "./create-city";

export default async (req, res) => {

    try {
        const cityService: CityService = req.scope.resolve(CityService.resolutionKey);
        
        const validated = await validator(AdminPostCityListReq, req.body)
      
        const entityManager: EntityManager = req.scope.resolve("manager")

       const newCities = await entityManager.transaction(async (manager) => {

        let { cities } = validated
        
       //check the request contains city array
        if(cities.length == 0) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `City array must be provided`
          )
        }
        
      //check each city has its related areas.
      for(const city of cities) {
          if(city.areas.length == 0) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `A city must have its related area.`
              )
          }
        }
     
    // check the city id of each area is the same to its related city's id
    for(const city of cities) {
        let areas = city.areas;
        const ids = areas.map(a => a.city_id);
        const isAllow = (id) => id == city.id;
        if(!ids.every(isAllow)) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `The area must refer to its related city`
              )
        }
        

      }

     // save each city together with its related areas
     const newCities: City[] = [];
     for(const city of cities) {
        const newCity = await cityService
                        .withTransaction(manager)
                        .create(city as CreateCityInput);
        newCities.push(newCity);
      }
      return newCities;
    });
    
    res.json({ cities: newCities })
   
} catch (e: any) {
    let data = { "type" : e.type, "message" : e.message};
    let result = core_response(e.type, data)
    
    res.status(result['code']).send(result['body']);
}
}

  export class AdminPostCityListReq {

    @IsArray()
    @Type(() => AdminPostCityReq)
    @ValidateNested({ each: true })
    cities: AdminPostCityReq[] = []

  }