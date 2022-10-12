import  {CustomerService } from "../services/customer.service"
import { IsEmail } from "class-validator"
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { EntityManager } from "typeorm"

/**
 * @oas [post] /v1/store/customers/reset-password-token
 * summary: Request Password Reset
 * description: "Creates a reset password token to be used in a subsequent /reset-password request. The password token should be sent out of band e.g. via email and will not be returned."
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - email
 *         properties:
 *           email:
 *             description: "The email of the customer."
 *             type: string
 *             format: email
 * responses:
 *   204:
 *     description: OK
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
    StorePostCustomersCustomerPasswordTokenReq,
    req.body
  )

  const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
  
  const customer = await customerService.retrieveByEmail(validated.email)

  // Will generate a token and send it to the customer via an email provider
  const manager: EntityManager = req.scope.resolve("manager")
//   await manager.transaction(async (transactionManager) => {
//     return await customerService
//       .withTransaction(transactionManager)
//       .generateResetPasswordToken(customer.id)
//   })

  //res.sendStatus(204)
  const token:string = await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .generateResetPasswordToken(customer.id)
  })
  res.json({ token });
}

export class StorePostCustomersCustomerPasswordTokenReq {
  @IsEmail()
  email: string
}