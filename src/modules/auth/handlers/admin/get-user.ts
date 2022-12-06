/**
 * @oas [get] /v1/store/auth
 * operationId: "GetAuth"
 * summary: "Get Current Customer"
 * description: "Gets the currently logged in Customer."
 * x-authenticated: true
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 */
import { CustomerService } from "../../../customer/v1/services/customer.service"
export default async (req, res) => {
  //console.log("req.user = ",req.user);

  if (req.user && req.user.customer_id) {
    const customerService: CustomerService =
      req.scope.resolve("customerService")

    const customer = await customerService.retrieve(req.user.customer_id, {
      relations: ["shipping_addresses", "orders", "orders.items"],
    })

    res.json({ customer })
  } else {
    res.sendStatus(401)
  }
}