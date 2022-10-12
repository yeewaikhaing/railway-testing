
/**
 * @oas [post] /v1/admin/pricing-groups/{id}
 * description: "Updates a pricing group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the pricing group.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             type: string
 *             description: Name of the pricing group.
 *           price:
 *             type: number
 *             description:  Price of pricing group.
 *           is_disabled:
 *             type: boolean
 *             description:  Indication of if the pricing group is active.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.update(sales_channel_id, {
 *         name: 'App'
 *       })
 *       .then(({ sales_channel }) => {
 *         console.log(sales_channel.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
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
 *             price_group:
 *               $ref: "#/components/schemas/price_group"
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
 import {IsBoolean, IsNumber, IsOptional, IsString } from "class-validator"
 import { Request, Response } from "express"
 
 import { PriceGroupService } from "../priceGroup.service" ;
 import { EntityManager } from "typeorm"
 
export default async (req: Request, res: Response) => {
  const { id } = req.params
  const { validatedBody } = req as {
    validatedBody: AdminPostPriceGroupsPriceGroupReq
  }

  const priceGroupService: PriceGroupService = req.scope.resolve(
    PriceGroupService.resolutionKey
  );
  const manager: EntityManager = req.scope.resolve("manager")
  const price_group = await manager.transaction(
    async (transactionManager) => {
      return await priceGroupService
        .withTransaction(transactionManager)
        .update(id, validatedBody)
    }
  )

  res.status(200).json({ price_group })
}

export class AdminPostPriceGroupsPriceGroupReq {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsNumber()
  price?: number

  @IsBoolean()
  @IsOptional()
  is_disabled?: boolean
}