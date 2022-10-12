/**
 * @oas [get] /v1/admin/search-categories
 * description: "Retrieves a list of category"
 * x-authenticated: true
 * parameters:
 *   - (query) id {string} ID of the category
 *   - (query) name {string} Name of the category
 *   - (query)  of the pricing group
 *   - (query) q {string} Query used for searching 
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
 *   - (query) expand {string} (Comma separated) Which fields should be expanded in each category of the result.
 *   - (query) fields {string} (Comma separated) Which fields should be included in each category of the result.
 
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/categories' \
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
 *                 $ref: "#/components/schemas/categories"
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
 import { CategoryService } from "../services/category.service"; 
 import { Request, Response } from "express";
 import { IsOptional, IsString, ValidateNested } from "class-validator";
 import {
    DateComparisonOperator,
    extendedFindParamsMixin,
  } from "@medusajs/medusa/dist/types/common";
import { Type } from "class-transformer";

 export default async (req: Request, res: Response) => {
    const categoryService: CategoryService = req.scope.resolve(
        CategoryService.resolutionKey
    )

    /** find list and count */
    let  listConfig = req.listConfig;
    
    const filterableFields = req.filterableFields
   
    const [categories, count] = await categoryService.listAndCount(
      filterableFields,
      listConfig
    )
    
    res.status(200).json({
      categories: categories,
     count,
     offset: listConfig.skip,
     limit: listConfig.take,
   })
   
  }
  
  export class AdminGetCategoryParams extends extendedFindParamsMixin() {
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
    parent_id?: string

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