
/**
 * @oas [delete] /v1/admin/pricing-groups/{id}
 * description: "Deletes the pricing group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the pricing group.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.delete(sales_channel_id)
 *       .then(({ id, object, deleted }) => {
 *         console.log(id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request DELETE 'https://medusa-url.com/admin/sales-channels/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             id:
 *               type: string
 *               description: The ID of the deleted pricing group
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: pricing_group
 *             deleted:
 *               type: boolean
 *               description: Whether or not the items were deleted.
 *               default: true
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
 import { Request, Response } from "express"

 import { EntityManager } from "typeorm"
 import { PriceGroupService } from "../priceGroup.service" ;
 
export default async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params

  const priceGroupService: PriceGroupService = req.scope.resolve(
    PriceGroupService.resolutionKey
  );
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await priceGroupService
      .withTransaction(transactionManager)
      .delete(id)
  })

  res.json({
    id,
    object: "pricing_group",
    deleted: true,
  })
}