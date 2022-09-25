/**
 * @oas [post] /v1/store/auth
 * operationId: "PostAuth"
 * summary: "Authenticate a User"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) login_info=* {string} The User's email or phone.
 *   - (body) password=* {string} The User's password.
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            user:
 *              $ref: "#/components/schemas/user"
 */
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { AuthService } from "../auth.service";
import { EntityManager } from "typeorm";
import jwt from "jsonwebtoken";
import { CustomerService } from "../../customer/v1/services/customer.service";
import {  IsNotEmpty } from "class-validator";

export default async (req, res) => {
    const validated = await validator(StorePostAuthReq, req.body)
  
    //const authService: MyAuthService = req.scope.resolve("myService");
    const authService: AuthService = req.scope.resolve(AuthService.resolutionKey);
    const manager: EntityManager = req.scope.resolve("manager");
    const result = await manager.transaction(async (transactionManager) => {
      return await authService
        .withTransaction(transactionManager)
        .authenticateCustomer(validated.login_info, validated.password)
    })
  
    if (!result.success) {
      res.sendStatus(401)
      return
    }
  
    // Add JWT to cookie
    const {
      projectConfig: { jwt_secret },
    } = req.scope.resolve("configModule")
    req.session.jwt = jwt.sign(
      { customer_id: result.customer?.id },
      jwt_secret!,
      {
        expiresIn: "30d",
      }
    )
  
    const customerService: CustomerService = req.scope.resolve("customerService")
    const customer = await customerService.retrieve(result.customer?.id || "", {
      relations: ["orders", "orders.items"],
    })
  
    res.json({ customer })
  }
  export class StorePostAuthReq {
    @IsNotEmpty()
    login_info: string
  
    @IsNotEmpty()
    password: string
  }