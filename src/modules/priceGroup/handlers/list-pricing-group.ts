/**
 * @oas [get] /v1/admin/pricing-groups
 * description: "Retrieves a list of pricing group"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} ID of the pricing group
 *   - (query) name {string} Name of the pricing group
 *   - (query) price {string} Price of the pricing group
 *   - (query) q {string} Query used for searching pricing group' names and prices.
 *   - (query) order {string} The field to order the results by.
 *   - in: query
 *     name: created_at
 *     description: Date comparison for when resulting collections were created.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: updated_at
 *     description: Date comparison for when resulting collections were updated.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - in: query
 *     name: deleted_at
 *     description: Date comparison for when resulting collections were deleted.
 *     schema:
 *       type: object
 *       properties:
 *         lt:
 *            type: string
 *            description: filter by dates less than this date
 *            format: date
 *         gt:
 *            type: string
 *            description: filter by dates greater than this date
 *            format: date
 *         lte:
 *            type: string
 *            description: filter by dates less than or equal to this date
 *            format: date
 *         gte:
 *            type: string
 *            description: filter by dates greater than or equal to this date
 *            format: date
 *   - (query) offset=0 {integer} How many price groups to skip in the result.
 *   - (query) limit=20 {integer} Limit the number of price groups returned.
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each price group of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each price group of the result.
 
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/sales-channels' \
 *       --header 'Authorization: Bearer {api_token}'
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
 *             price_groups:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/price_group"
 *             count:
 *               type: integer
 *               description: The total number of items available
 *             offset:
 *               type: integer
 *               description: The number of items skipped before these items
 *             limit:
 *               type: integer
 *               description: The number of items per page
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
 import { PriceGroupService } from "../priceGroup.service";
 import { Request, Response } from "express";
 import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
 import {
    DateComparisonOperator,
    extendedFindParamsMixin,
  } from "@medusajs/medusa/dist/types/common";
import { Type } from "class-transformer";

 export default async (req: Request, res: Response) => {
    const priceGroupService: PriceGroupService = req.scope.resolve(
        PriceGroupService.resolutionKey
    )
  
    const listConfig = req.listConfig
    const filterableFields = req.filterableFields
  
    const [priceGroups, count] = await priceGroupService.listAndCount(
      filterableFields,
      listConfig
    )
  
    res.status(200).json({
      price_groups: priceGroups,
      count,
      offset: listConfig.skip,
      limit: listConfig.take,
    })
  }
  
  export class AdminGetPriceGroupParams extends extendedFindParamsMixin() {
    @IsString()
    @IsOptional()
    id?: string
  
    @IsOptional()
    @IsString()
    q?: string
  
    @IsOptional()
    @IsString()
    name?: string
  
    @IsOptional()
    @IsString()
    price?: number

    @IsOptional()
    @IsString()
    is_disabled?: boolean
  
    @IsOptional()
    @ValidateNested()
    @Type(() => DateComparisonOperator)
    created_at?: DateComparisonOperator
  
    @IsOptional()
    @ValidateNested()
    @Type(() => DateComparisonOperator)
    updated_at?: DateComparisonOperator
  
    @ValidateNested()
    @IsOptional()
    @Type(() => DateComparisonOperator)
    deleted_at?: DateComparisonOperator
  
    @IsString()
    @IsOptional()
    order?: string
  }