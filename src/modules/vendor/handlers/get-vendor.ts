/**
 * @oas [get] /admin/v1/vendors/{id}
 * summary: "Get a Vendor"
 * description: "Retrieves a Vendor."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the Vendor.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.retrieve(user_id)
 *       .then(({ user }) => {
 *         console.log(user.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/users/{id}' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             user:
 *               $ref: "#/components/schemas/vendor"
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
 
import { VendorService } from "../services/vendor.service";

export default async (req, res) => {
  const { vendor_id } = req.params

  const vendorService: VendorService = req.scope.resolve(VendorService.resolutionKey);

  const vendor = await vendorService.retrieve(vendor_id, req.retrieveConfig)
//   const rawVendor = await vendorService.retrieve(newVendor.id, {
//     relations: ["user", "payments", "user.store"]
//     })
  res.json({ vendor })
  
}