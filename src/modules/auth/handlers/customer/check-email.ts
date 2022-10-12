
/**
 * @oas [get] /v1/store/auth/email/{email}
 * operationId: "GetAuthEmail"
 * summary: "Check if email exists"
 * description: "Checks if a Customer with the given email has signed up."
 * parameters:
 *   - in: path
 *     name: email
 *     schema:
 *       type: string
 *       format: email
 *     required: true
 *     description: The email to check if exists.
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            exists:
 *              type: boolean
 *              description: Whether email exists or not.
 */
import { CustomerService } from "../../../customer/v1/services/customer.service";

export default async (req, res) => {
  const { email } = req.params

  try {
    const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
    const customer = await customerService.retrieveByEmail(email, {
      select: ["has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}