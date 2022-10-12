
/**
 * @oas [post] /admin/v1/users
 * summary: "Create a User"
 * description: "Creates a User"
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - password
 *         properties:
 *           email:
 *             description: "The Users email."
 *             type: string
 *             format: email
 *           first_name:
 *             description: "The name of the User."
 *             type: string
 *           last_name:
 *             description: "The name of the User."
 *             type: string
 *           phone:
 *             description: "The phone number of the User."
 *             type: string
 *           user_name:
 *             description: "The user name of the User."
 *             type: string
 *           custom_role:
 *             description: "Userrole assigned to the user."
 *             type: string
 *             enum: [admin, member, developer, vendor]
 *           password:
 *             description: "The Users password."
 *             type: string
 *             format: password
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.create({
 *         email: 'user@example.com',
 *         password: 'supersecret'
 *       })
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/users' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "password": "supersecret"
 *       }'
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
 *             user:
 *               $ref: "#/components/schemas/user"
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
 import { IsEmail, IsEnum, IsOptional, IsString } from "class-validator"

 import { CustomUserRoles } from "../entities/user.entity"
 import {UserService} from "../services/user.service"
 import _ from "lodash"
 import { validator } from "@medusajs/medusa/dist/utils/validator"
 import { EntityManager } from "typeorm"
import { Store } from "../../store/entities/store.entity"
import { core_response } from "../../app/coreResponse";

export default async (req, res) => {

  try {
    //console.log("req....", req.user.userId);
    
      const validated = await validator(AdminCreateUserRequest, req.body)

      const userService: UserService = req.scope.resolve(UserService.resolutionKey);
      //const data = _.omit(validated, ["password"])

      const manager: EntityManager = req.scope.resolve("manager")
      let user = await manager.transaction(async (transactionManager) => {
        return await userService
          .withTransaction(transactionManager)
          .create(validated, req.user.userId)
      })
      
      res.status(200).json({ user: _.omit(user, ["password_hash"]) })
  }  catch (e: any) {
    let data = { "type" : e.type, "message" : e.message};
    let result = core_response(e.type, data)
   
    res.status(result['code']).send(result['body']);
   
}
  
}

export class AdminCreateUserRequest {
  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsString()
  first_name: string

  @IsString()
  last_name: string

  // @IsEnum(UserRoles)
  // @IsOptional()
  // role?: UserRoles

  @IsEnum(CustomUserRoles)
  @IsOptional()
  custom_role?: CustomUserRoles

  @IsOptional()
  @IsString()
  phone?: string

  @IsOptional()
  @IsString()
  user_name?: string

  @IsOptional()
  @IsString()
  store_id?: string

  // @IsOptional()
  // store?: Store

  
}
