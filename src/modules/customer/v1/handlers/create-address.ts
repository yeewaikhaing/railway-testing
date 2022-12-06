import { Type } from "class-transformer"
import { ValidateNested } from "class-validator"
import { defaultStoreCustomersFields } from "../routers/customer.router";
import { defaultStoreCustomersRelations } from "../routers/customer.router";
import { CustomerService } from "../services/customer.service";
//import { AddressCreatePayload } from "../types/address";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { EntityManager } from "typeorm"
import {
  IsBoolean,
  IsOptional,
  IsString,
} from "class-validator";
import { DeliveryAreaService } from "../../../delivery/services/deliveryArea.service";
/**
 * @oas [post] /store/v1/customers/me/addresses
 * summary: "Add a Shipping Address"
 * description: "Adds a Shipping Address to a Customer's saved addresses."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - first_name
 *           - last_name
 *           - city
 *           - address_1
 *           - delivery_area_id
 *         properties:
 *           first_name:
 *             description: "The first name of the Customer."
 *             type: string
 *           last_name:
 *             description: "The last name of the Customer."
 *             type: string
 *           city:
 *             description: "The city name of the Customer."
 *             type: string
 *           address_1:
 *             description: "The address 1 of the Customer."
 *             type: string   
 *           address_2:
 *             description: "The address 2 of the Customer."
 *             type: string   
 *           phone:
 *             description: "The phone number of the Customer."
 *             type: string   
 *           company:
 *             description: "The company name of the Customer."
 *             type: string  
 *           country_code:
 *             description: "The country code of the address."
 *             type: string 
 *           province:
 *             description: "The province of the address."
 *             type: string
 *           postal_code:
 *             description: "The postal code of the address."
 *             type: string
 *           default_billing:
 *             description: "Set this address to default billing"
 *             type: boolean
 *           default_shipping:
 *             description: "Set this address to default shipping"
 *             type: boolean
 *           delivery_area_id:
 *             description: "The delivery area id the location"
 *             type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged
 *       medusa.customers.addresses.addAddress({
 *         address: {
 *           first_name: 'Celia',
 *           last_name: 'Schumm',
 *           address_1: '225 Bednar Curve',
 *           city: 'Danielville',
 *           country_code: 'US',
 *           postal_code: '85137',
 *           phone: '981-596-6748 x90188',
 *           company: 'Wyman LLC',
 *           address_2: '',
 *           province: 'Georgia',
 *           metadata: {}
 *         }
 *       })
 *       .then(({ customer }) => {
 *         console.log(customer.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/store/customers/me/addresses' \
 *       --header 'Cookie: connect.sid={sid}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "address": {
 *             "first_name": "Celia",
 *             "last_name": "Schumm",
 *             "address_1": "225 Bednar Curve",
 *             "city": "Danielville",
 *             "country_code": "US",
 *             "postal_code": "85137"
 *           }
 *       }'
 * security:
 *   - cookie_auth: []
 * tags:
 *   - Customer
 * responses:
 *  "200":
 *    description: "A successful response"
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            customer:
 *              $ref: "#/components/schemas/customer"
 *  "400":
 *    $ref: "#/components/responses/400_error"
 *  "401":
 *    $ref: "#/components/responses/unauthorized"
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
  const id = req.user.customer_id

  const validated = await validator(
    StorePostCustomersCustomerAddressesReq,
    req.body
  )
  //console.log("validated, ", validated);
  const{ delivery_area_id } = validated;

  const deliveryAreaService: DeliveryAreaService = req.scope.resolve(DeliveryAreaService.resolutionKey);
  const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);

  //check the given area_id is valid
  await deliveryAreaService.retrieve(delivery_area_id);
  
  const manager: EntityManager = req.scope.resolve("manager")
  await manager.transaction(async (transactionManager) => {
    return await customerService
      .withTransaction(transactionManager)
      .addAddress(id, validated)
  })

  const customer = await customerService.retrieve(id, {
    relations: defaultStoreCustomersRelations,
    select: defaultStoreCustomersFields,
  })

  res.status(200).json({ customer })
 
}

export class StorePostCustomersCustomerAddressesReq {
  // @ValidateNested({each: true})
  // @Type(() => AddressCreatePayload)
  // address: AddressCreatePayload

  @IsString()
    first_name: string
  
    @IsString()
    last_name: string
  
    @IsString()
    phone: string
  
    @IsOptional()
    metadata: object
  
    @IsOptional()
    @IsString()
    company: string
  
    @IsString()
    address_1: string
  
    @IsOptional()
    @IsString()
    address_2: string
  
    @IsString()
    city: string
  
    @IsString()
    @IsOptional()
    country_code: string = 'mm'
  
    @IsOptional()
    @IsString()
    province: string
  
    @IsString()
    @IsOptional()
    postal_code: string

    @IsString()
    delivery_area_id: string

    @IsString()
    @IsOptional()
    label: string = 'Default'

    @IsBoolean()
    @IsOptional()
    default_billing: boolean = false

    @IsBoolean()
    @IsOptional()
    default_shipping: boolean = false
    

}