import { IsEmail, IsString } from "class-validator"
import jwt, { JwtPayload } from "jsonwebtoken"
import  {CustomerService } from "../services/customer.service"
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { EntityManager } from "typeorm"

/**
 * @oas [post] /store/v1/customers/reset-password
 * description: "Resets a Customer's password using a password token created by a previous /password-token request."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *           - password
 *           - token
 *         properties:
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *             format: email
 *           password:
 *             description: "The Customer's password."
 *             type: string
 *             format: password
 *           token:
 *             description: "The reset password token"
 *             type: string
 * responses:
 *   200:
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
export default async (req, res) => {
  const validated = await validator(
    StorePostCustomersResetPasswordReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
  let customer = await customerService.retrieveByEmail(validated.email, {
    select: ["id", "password_hash"],
  })

  const decodedToken = jwt.verify(
    validated.token,
    customer.password_hash
  ) as JwtPayload
  if (!decodedToken || customer.id !== decodedToken.customer_id) {
    res.status(401).send("Invalid or expired password reset token")
    return
  }

  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .update(customer.id, {
        password: validated.password,
      })
  })

  customer = await customerService.retrieve(customer.id)
  res.status(200).json({ customer })
}

export class StorePostCustomersResetPasswordReq {
  @IsEmail()
  email: string

  @IsString()
  token: string

  @IsString()
  password: string
}