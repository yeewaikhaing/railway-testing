
/**
 * @oas [get] /v1/store/auth/username/{username}
 * summary: "Check if username exists"
 * description: "Checks if a Customer with the given username has signed up."
 * parameters:
 *   - in: path
 *     name: username
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
  const { username } = req.params

  try {
    const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
    const customer = await customerService.retrieveByUsername(username, {
      select: ["has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}