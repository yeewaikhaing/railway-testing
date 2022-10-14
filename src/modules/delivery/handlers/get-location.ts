/**
 * @oas [get] /admin/v1/cities/:id/locations
 * description: "Retrieves unpricing Locations of the given city id"
 * x-authenticated: true
 * * parameters:
 *   - (path) id=* {string} The ID of the City.
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.users.list()
 *       .then(({ users }) => {
 *         console.log(users.length);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/users' \
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
 *             vendors:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/city"
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

import { CityService } from "../../delivery/services/city.service"

export default async (req, res) => {
 
  const { id } = req.params;
  const cityService: CityService = req.scope.resolve(CityService.resolutionKey)
  
  const filterableFields = req.filterableFields

  filterableFields.id = id; // convert req.params.id to filterableFields:{ id: '2' }
  
  //console.log("filterable ", filterableFields);
  
  
  const locations = await cityService.list(filterableFields)
  
  res.status(200).json({ locations })
}

