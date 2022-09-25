/**
 * @oas [post] /v1/admin/pricing-groups
 * description: "Creates a Pricing Group."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - name
 *           - price
 *         properties:
 *           name:
 *             description: The name of the price group
 *             type: string
 *           price:
 *             description: The price of the price group
 *             type: string
 
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
import { CreatePriceGroupInput } from "../types/price-group";
import { PriceGroupService } from "../priceGroup.service";
import { EntityManager } from "typeorm" 
import { Request, Response } from "express";
import {IsNumber, IsString } from "class-validator"

 export default async (req: Request, res: Response) => {
    const validatedBody = req.validatedBody as CreatePriceGroupInput;
    console.log("validateBody", validatedBody);
    
    const priceGroupService: PriceGroupService = req.scope.resolve(PriceGroupService.resolutionKey);
  
    const manager: EntityManager = req.scope.resolve("manager")
    const priceGroup = await manager.transaction(async (transactionManager) => {
      return await priceGroupService
        .withTransaction(transactionManager)
        .create(validatedBody)
    })
  
    res.status(200).json({ price_group: priceGroup })
  }
  
  export class AdminPostPriceGroupReq {
    @IsString()
    name: string
  
    @IsNumber()
    price: number
  
   
  }