import { IsOptional, IsString } from "class-validator"
import { defaultAdminDiscountsFields, defaultAdminDiscountsRelations } from "../routers/discount.router";

import { Discount } from "../entities/discount.entity"
import { DiscountService } from "../services/discount.service"
import { getRetrieveConfig } from "@medusajs/medusa/dist/utils/get-query-config"
import { validator } from "@medusajs/medusa/dist/utils/validator"
/**
 * @oas [get] /admin/v1/discounts/{id}
 * operationId: "GetDiscountsDiscount"
 * summary: "Get a Discount"
 * description: "Retrieves a Discount"
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Discount
 *   - (query) expand {string} Comma separated list of relations to include in the results.
 *   - (query) fields {string} Comma separated list of fields to include in the results.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.discounts.retrieve(discount_id)
 *       .then(({ discount }) => {
 *         console.log(discount.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/discounts/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Discount
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             discount:
 *               $ref: "#/components/schemas/discount"
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
export default async (req, res) => {
  const { discount_id } = req.params

  const validated = await validator(AdminGetDiscountParams, req.query)

  const config = getRetrieveConfig<Discount>(
    defaultAdminDiscountsFields,
    defaultAdminDiscountsRelations,
    validated?.fields?.split(",") as (keyof Discount)[],
    validated?.expand?.split(",")
  )

  const discountService: DiscountService = req.scope.resolve(DiscountService.resolutionKey);
  const data = await discountService.retrieve(discount_id, config)

  res.status(200).json({ discount: data })
}

export class AdminGetDiscountParams {
  @IsOptional()
  @IsString()
  expand?: string

  @IsOptional()
  @IsString()
  fields?: string
}