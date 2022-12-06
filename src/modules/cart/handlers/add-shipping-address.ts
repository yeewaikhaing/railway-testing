import { IsOptional, IsString, IsNumber, IsNotEmpty } from "class-validator"
import { defaultStoreCartFields, defaultStoreCartRelations } from "../routers/cart.router"


import { EntityManager } from "typeorm"
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { CartService } from "../services/cart.service";


/**
 * @oas [post] /store/v1/carts/{cart_id}/shipping-addresses
 * description: "Adds a shipping address to the Cart."
 * summary: "Add a  Shipping Address"
 * parameters:
 *   - (path) id=* {string} The cart ID.
 *   - (body) option_id=* {string} ID of the shipping option to create the method from
 *   - (body) address_id=* {string} The ID of user address to create shipping 
 *   - (body) price=* {number} The price of custom shipping 
 *   - (body) data {Object} Used to hold any data that the shipping method may need to process the fulfillment of the order. Look at the documentation for your installed fulfillment providers to find out what to send.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.carts.addShippingMethod(cart_id, {
 *         option_id,
 *          price
 *       })
 *       .then(({ cart }) => {
 *         console.log(cart.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/carts/{id}/shipping-methods' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "option_id": "{option_id}",
 *           "price": 0,
 *          "addresss_id": "addr_12345"
 *       }'
 * tags:
 *   - Cart
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            cart:
 *              $ref: "#/components/schemas/cart"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "404":
 *    $ref: "#/components/responses/not_found_error"
 *  "409":
 *    $ref: "#/components/responses/invalid_state_error"
 *  "422":
 *    $ref: "#/components/responses/invalid_request_error"
 *  "500":
 *    $ref: "#/components/responses/500_error"
 */
export default async (req, res) => {
  const { cart_id } = req.params
  
  const customer_id = req.user.customer_id

  const validated = await validator(
    StorePostCartsCartShippingAddressReq,
    req.body
  )

  const manager: EntityManager = req.scope.resolve("manager")
  const cartService: CartService = req.scope.resolve(CartService.resolutionKey)

  await manager.transaction(async (m) => {
    const txCartService = cartService.withTransaction(m)

    // add custom shipping option & shipping method
    await txCartService.addShippingAddress(
      customer_id,
      cart_id,
      validated
    )

      const updated = await txCartService.retrieve(cart_id, {
        relations: ["payment_sessions"],
      })
  
      if (updated.payment_sessions?.length) {
        await txCartService.setPaymentSessions(cart_id)
      }
     })
  
    const data = await cartService.retrieveWithTotals(cart_id, {
      select: defaultStoreCartFields,
      relations: defaultStoreCartRelations,
    })
  
    res.status(200).json({ cart: data })
}

export class StorePostCartsCartShippingAddressReq {
  

  @IsString()
  address_id: string

  @IsOptional()
  data?: Record<string, any> = {}

}