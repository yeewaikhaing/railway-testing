/**
 * @oas [get] /store/v1/customers/me
 * summary: Get a Customer
 * description: "Retrieves a Customer - the Customer must be logged in to retrieve their details."
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
import { CustomerService } from "../services/customer.service";
import { defaultStoreCustomersFields } from "../routers/customer.router";
import { defaultStoreCustomersRelations } from "../routers/customer.router";

 export default async (req, res) => {
    const id = req.user.customer_id
  
    const customerService: CustomerService = req.scope.resolve("customerService")
  
    const customer = await customerService.retrieve(id, {
      relations: defaultStoreCustomersRelations,
      select: defaultStoreCustomersFields,
    })
  
    res.json({ customer })
  }