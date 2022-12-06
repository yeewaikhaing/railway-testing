/**
 * @oas [get] /admin/v1/users
 * operationId: "GetUsers"
 * summary: "List Users"
 * description: "Retrieves all users."
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *       .then(({ users }) => {
 *         console.log(users.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/users' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/user"
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
 import { UserService } from "../services/user.service"
 import { IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
 import {
    DateComparisonOperator,
    extendedFindParamsMixin,
  } from "@medusajs/medusa/dist/types/common";
import { Type } from "class-transformer";
import { Store } from "../../store/entities/store.entity";
import { Vendor } from "../../vendor/entities/vendor.entity";
export default async (req, res) => {
  const loggedInUserId = req.user.userId;
  const userService: UserService = req.scope.resolve(UserService.resolutionKey);
  
  const listConfig = req.listConfig
  const filterableFields = req.filterableFields

  //listConfig.

  const [users, count] = await userService.listAndCount(
    loggedInUserId,
    filterableFields,
    listConfig
  )


  //console.log("listConfig,", listConfig);
  //console.log("filterablefileds, ", filterableFields);
  
  
    // const [users, count] = await userService.listAndCount( {
    //   relations: defaultAdminUsersRelations,
    //   select: defaultAdminUsersFields,
    // })
    res.status(200).json({
      users: users,
      count,
      offset: listConfig.skip,
      limit: listConfig.take,
    })

//   const user = await userService.retrieve(user_id, {
//     relations: defaultAdminUsersRelations,
//     select: defaultAdminUsersFields,
//   })
 // res.status(200).json({ users })
}

export class AdminGetUsersParams extends extendedFindParamsMixin() {
  
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  offset?: number = 0

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  limit?: number = 50
  
  @IsString()
    @IsOptional()
    id?: string
  
    @IsOptional()
    @IsString()
    q?: string
  
    @IsOptional()
    @IsString()
    email?: string
  
    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    user_name?: string

    @IsOptional()
    @IsString()
    first_name?: string

    @IsOptional()
    @IsString()
    last_name?: string

    @IsOptional()
    @IsString()
    custom_role?: string

    // @IsOptional()
    // store?: Store

    @IsOptional()
    @ValidateNested()
    vendor?: Vendor
  
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