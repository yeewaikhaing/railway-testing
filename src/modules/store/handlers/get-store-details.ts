import { FulfillmentProvider, PaymentProvider } from "@medusajs/medusa/dist/models"
import {
  FulfillmentProviderService,
  PaymentProviderService,
} from "@medusajs/medusa/dist/services"
import { FeatureFlagsResponse } from "@medusajs/medusa/dist/types/feature-flags"
import { FlagRouter } from "@medusajs/medusa/dist/utils/flag-router"
import { Store } from "../entities/store.entity"
import StoreService from "../services/store.service"

/**
 * @oas [get] /admin/v1/store
 * operationId: "GetStore"
 * summary: "Get Store details"
 * description: "Retrieves the Store details"
 * x-authenticated: true
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.store.retrieve()
 *       .then(({ store }) => {
 *         console.log(store.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/admin/store' \
 *       --header 'Authorization: Bearer {api_token}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Store
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             store:
 *               $ref: "#/components/schemas/store"
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
export default async (req, res) => {
  const storeService: StoreService = req.scope.resolve(StoreService.resolutionKey);

  const featureFlagRouter: FlagRouter = req.scope.resolve("featureFlagRouter")

  const paymentProviderService: PaymentProviderService = req.scope.resolve(
    "paymentProviderService"
  )
  const fulfillmentProviderService: FulfillmentProviderService =
    req.scope.resolve("fulfillmentProviderService")

  const relations = ["currencies", "default_currency"]
//   if (featureFlagRouter.isFeatureEnabled("sales_channels")) {
//     relations.push("default_sales_channel")
//   }

  const data = (await storeService.retrieve({
    relations,
  })) as Store & {
    payment_providers: PaymentProvider[]
    fulfillment_providers: FulfillmentProvider[]
   // feature_flags: FeatureFlagsResponse
  }

  //data.feature_flags = featureFlagRouter.listFlags()

  const paymentProviders = await paymentProviderService.list()
  const fulfillmentProviders = await fulfillmentProviderService.list()

  data.payment_providers = paymentProviders
  data.fulfillment_providers = fulfillmentProviders

  res.status(200).json({ store: data })
}