/**
 * @oas [post] /admin/v1/pricing-groups
 * description: "Creates a Pricing Group."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - name
 *           - price
 *           - area_ids
 *         properties:
 *           name:
 *             description: The name of the price group
 *             type: string
 *           price:
 *             description: The price of the price group
 *             type: string
 *           area_ids:
 *             description: The areas id with the price group
 *             type: array
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.create({
 *         name: 'App',
 *         description: 'Mobile app'
 *       })
 *       .then(({ price_group }) => {
 *         console.log(price_group.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App",
 *          "price" : 100
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             sales_channel:
 *               $ref: "#/components/schemas/sales_channel"
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
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { PriceGroupService}  from "../priceGroup.service";
import { EntityManager } from "typeorm" 
import { Request, Response } from "express";
import {IsNumber, IsString, IsBoolean, IsOptional, IsArray} from "class-validator"
import { core_response } from "../../app/coreResponse";
import { MedusaError } from "medusa-core-utils";
import { DeliveryAreaService } from "../../delivery/services/deliveryArea.service";

 export default async (req: Request, res: Response) => {
    try {
       const validated = await validator(AdminPostPriceGroupReq, req.body)
      
       const { area_ids  } = validated;
       delete validated.area_ids;

      // console.log("areas ", area_ids);
       
       //check the request contain pricing areas
       if(area_ids.length == 0) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `The area id array(area_ids[]) must be provided for this pricing group`
        )
      }

      const priceGroupService: PriceGroupService = req.scope.resolve(PriceGroupService.resolutionKey);
      const deliveryAreaService: DeliveryAreaService = req.scope.resolve(DeliveryAreaService.resolutionKey);

      // check the given area ids exist in database
      const  count  = await deliveryAreaService.countById(area_ids);
      
      if(count != area_ids.length) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Invalid the given area id. Please check your area id`
        )
      }
      
      
      
      const manager: EntityManager = req.scope.resolve("manager")
      const newPriceGroup = await manager.transaction(async (transactionManager) => {
      
      const newPriceGroup = await priceGroupService
                              .withTransaction(manager)
                              .create(validated);
      
      await deliveryAreaService
            .withTransaction(manager)
            .updatePricing(newPriceGroup.id, area_ids);
    
        return newPriceGroup;
      })
      
      const rawPricingGroup = await priceGroupService.retrieve(newPriceGroup.id, {
        relations: ["areas"]
        })

     
      res.status(200).json({ "priceGroup": rawPricingGroup })
      //res.status(200).send();
    } catch (e: any) {
      let data = { "type" : e.type, "message" : e.message};
        let result = core_response(e.type, data)
       
        res.status(result['code']).send(result['body']);
    }
  }
  
  export class AdminPostPriceGroupReq {
    @IsString()
    name: string
  
    @IsNumber()
    price: number

    @IsBoolean()
    @IsOptional()
    is_disabled?: boolean

    @IsArray()
    area_ids: string[] = []
  
  }