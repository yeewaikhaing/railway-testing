/**
 * @oas [post] /store/v1/customers
 * operationId: "PostCustomers"
 * summary: "Create a Customer"
 * description: "Creates a Customer."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - first_name
 *           - last_name
 *           - password
 *         properties:
 *           email:
 *             type: string
 *             description: The customer's email.
 *             format: email
 *           first_name:
 *             type: string
 *             description: The customer's first name.
 *           last_name:
 *             type: string
 *             description: The customer's last name.
 *           password:
 *             type: string
 *             description: The customer's password.
 *             format: password
 *           phone:
 *             type: string
 *             description: The customer's phone number.
 *           user_name:
 *             type: string
 *             description: The customer's user name.
 *           metadata:
 *             description: An optional set of key-value pairs to hold additional information.
 *             type: object
 * tags:
 *   - Customer
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.customers.create({
 *         email: 'user@example.com',
 *         first_name: 'Caterina',
 *         last_name: 'Yost',
 *         password: 'supersecret'
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/customers' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "email": "user@example.com",
 *           "first_name": "Caterina",
 *           "last_name": "Yost",
 *           "password": "supersecret"
 *       }'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * responses:
 *   201:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
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
import  {CustomerService } from "../services/customer.service"
import { EntityManager } from "typeorm";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { IsEmail, IsOptional, IsString } from "class-validator"
import { Customer } from "../entities/customer.entity";
import jwt from "jsonwebtoken";
import { defaultStoreCustomersFields } from "../routers/customer.router";
import { defaultStoreCustomersRelations } from "../routers/customer.router";
import { core_response } from "../../../app/coreResponse";
export default async (req, res) => {
    //let 
    try {
        const validated = await validator(StorePostCustomersReq, req.body)
        const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
        const manager: EntityManager = req.scope.resolve("manager");
       let customer: Customer = await manager.transaction(
        async (transactionManager) => {
          return await customerService
                       .create(validated);
        }
      )
    
    //Add JWT to cookie
    const {
        projectConfig: { jwt_secret },
    } = req.scope.resolve("configModule")
    req.session.jwt = jwt.sign({ customer_id: customer.id }, jwt_secret!, {
        expiresIn: "30d",
    })

    customer = await customerService.retrieve(customer.id, {
        relations: defaultStoreCustomersRelations,
        select: defaultStoreCustomersFields,
      })
    
      res.status(200).json({ customer });
    } catch (e: any) {
        let data = { "type" : e.type, "message" : e.message};
        let result = core_response(e.type, data)
       
        res.status(result['code']).send(result['body']);
       
    }
    
}

export class StorePostCustomersReq {
    @IsString()
    first_name: string
  
    @IsString()
    last_name: string
  
    @IsEmail()
    email: string
  
    @IsString()
    password: string
  
    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    user_name?: string
  }