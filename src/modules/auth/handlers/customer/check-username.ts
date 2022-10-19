
/**
 * @oas [get] /store/v1/auth/username/{user_name}
 * summary: "Check if username exists"
 * description: "Checks if a Customer with the given username has signed up."
 * parameters:
 *   - (path) user_name=* {string} The user name to check if exists. 
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            exists:
 *              type: boolean
 */
import { CustomerService } from "../../../customer/v1/services/customer.service";

export default async (req, res) => {
  const { user_name } = req.params

  try {
    const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
    const customer = await customerService.retrieveByUsername(user_name, {
      select: ["has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}