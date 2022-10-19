
/**
 * @oas [get] /store/v1/auth/phone/{phone}
 * summary: "Check if phone exists"
 * description: "Checks if a Customer with the given phone has signed up."
 * parameters:
 *   - (path) phone=* {string} The phone number to check if exists. 
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
  const { phone } = req.params

  try {
    const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
    const customer = await customerService.retrieveByPhone(phone, {
      select: ["has_account"],
    })
    res.status(200).json({ exists: customer.has_account })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}