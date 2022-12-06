import { OrderService } from "../../services/order.service"
import { defaultStoreOrdersFields, defaultStoreOrdersRelations } from "../../routers/storefrontOrder.router";
import { IsString } from "class-validator";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { EntityManager } from "typeorm";
import { core_response } from "../../../app/coreResponse";
import { PaymentProviderService } from "../../../payment/services/paymentProvider.service";

/**
 * @oas [post]] /store/v1/orders/{id}/prepaid
 * description: "Create payment transfer for an Order with prepaid payment type"
 * parameters:
 *   - (path) id=* {string} The id of the Order.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       medusa.orders.retrieve(order_id)
 *       .then(({ order }) => {
 *         console.log(order.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/store/orders/{id}'
 * tags:
 *   - Order
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             order:
 *               $ref: "#/components/schemas/order"
 *   "400":
 *     $ref: "#/components/responses/400_error"
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
  try {
        const { id } = req.params
        const validated = await validator(
        StorePostCartsOrderPaymentPrepaidReq,
        req.body
        )
    
        const manager: EntityManager = req.scope.resolve("manager")
         const orderService: OrderService = req.scope.resolve(OrderService.resolutionKey);
        const paymentProviderService: PaymentProviderService = req.scope.resolve(PaymentProviderService.resolutionKey);

        // // // check order_id & cart_id is valid
        // const payment = await paymentProviderService
        // .retrieveByCartIdAndOrderId(validated.cart_id, id);

        // await manager.transaction(async (manager) => {
        // orderService.withTransaction(manager).createPrepaidPayment(id,validated);
    
        // })
        await manager.transaction(async (m) => {
            const order_service = orderService.withTransaction(m)
        
            const payment = await order_service.createPrepaidPayment(id,validated);
        
        })
        const order = await orderService.retrieve(id, {
        select: defaultStoreOrdersFields,
        relations: defaultStoreOrdersRelations,
        })
    
        res.json({ order })
  } catch (e: any) {
    let data = { "type" : e.type, "message" : e.message};
    let result = core_response(e.type, data)
   
    res.status(result['code']).send(result['body']);
   
}
}

export class StorePostCartsOrderPaymentPrepaidReq {
    
    @IsString()
    payment_proof: string

    @IsString()
    cart_id: string
  }