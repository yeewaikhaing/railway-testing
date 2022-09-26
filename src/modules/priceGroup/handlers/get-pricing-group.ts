/**
 * @oas [get] /v1/admin/pricing-groups/{id}
 * description: "Retrieves the pricing group."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the pricing group.
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/v1/admin/pricing-groups/{id}' \
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
 *             sales_channel:
 *               $ref: "#/components/schemas/price_group"
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
import { PriceGroupService } from "../priceGroup.service";
import { Request, Response } from "express";

 export default async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params
  
    const priceGroupService: PriceGroupService = req.scope.resolve(
      PriceGroupService.resolutionKey
    );
  
    const priceGroup = await priceGroupService.retrieve(id)
    res.status(200).json({ price_group: priceGroup })
  }