/**
 * @oas [post] /admin/v1/cities
 * description: "Create new a city and its associated areas"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *              required:
 *                  - id
 *                  - city_name
 *                  - areas
    *            properties:
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

import { MedusaError } from "medusa-core-utils";
import { Type } from "class-transformer"
import { EntityManager } from "typeorm";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { core_response } from "../../app/coreResponse";
import { CityService } from "../services/city.service";
import { CreateCityInput } from "../types/city";
import {
    IsArray,
    IsString,
    ValidateNested,
  } from "class-validator"
export default async (req, res) => {

    try {
        const cityService: CityService = req.scope.resolve(CityService.resolutionKey);
        
        const validated = await validator(AdminPostCityReq, req.body)
      
        const entityManager: EntityManager = req.scope.resolve("manager")

       const newCity = await entityManager.transaction(async (manager) => {

        const { areas } = validated;
        const city_id = validated.id;
        //check the request city has its related areas.
        if(areas.length == 0) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `A city must have its related area.`
            )
        }

        // check the city id of each area is the same to its related city's id
        const ids = areas.map(a => a.city_id);
        const isAllow = (id) => id == city_id;
        if(!ids.every(isAllow)) {
            throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `The area must refer to its related city`
              )
        }
        
     // save the city
     const newCity = await cityService
                        .withTransaction(manager)
                        .create(validated as CreateCityInput);
     
      return newCity;
    });
    
    res.json({ city: newCity })
   
} catch (e: any) {
    let data = { "type" : e.type, "message" : e.message};
    let result = core_response(e.type, data)
    
    res.status(result['code']).send(result['body']);
}
}


export class AdminPostCityAreaReq {

    @IsString()
    id: string

    @IsString()
    area_name: string

    @IsString()
    city_id: string

  }
  export class AdminPostCityReq {

    @IsString()
    id: string

    @IsString()
    city_name: string
    
    @IsArray()
    @Type(() => AdminPostCityAreaReq)
    @ValidateNested({ each: true })
    areas: AdminPostCityAreaReq[] = []

  }