/**
 * @oas [post] /admin/v1/vendors
 * summary: "Create a Vendor"
 * x-authenticated: true
 * description: "Creates a Vendor"
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - nrcno
 *           - primary_phone
 *           - user
 *           - payments
 *           - store
 *           - default_commision
 *         properties:
 *           default_commission:
 *             description: "The default commision value of the Vendor"
 *             type: number
 *           nrcno:
 *             description: "The Nrcno of the Vendor"
 *             type: string
 *           primary_phone:
 *             description: "The primary phone of the Vendor"
 *             type: string
 *           secondary_phone:
 *             description: "A secondary phone of the Vendor."
 *             type: string
 *           store:
 *             description: The Store to associate the Vendor with.
 *             type: object
 *             required:
 *               - name
 *               - store_type
 *               - seller_type
 *               - state_division
 *               - city
 *               - township
 *               - address
 *             properties:
 *               name:
 *                 description: The name of the Store.
 *                 type: string
 *               store_type:
 *                 description: The type of the Store.
 *                 type: enum(online, offical store, authorized)
 *               seller_type:
 *                 description: The seller type of the Store.
 *                 type: enum(wholesale, retail)
 *               state_division:
 *                 description: The state or division of the Store.
 *                 type: string
 *               city:
 *                 description: The city of the Store.
 *                 type: string
 *               township:
 *                 description: The township of the Store.
 *                 type: string
 *               address:
 *                 description: The name of the Store.
 *                 type: string
 *           user:
 *             description: The User to associate the Vendor with.
 *             type: object
 *             required:
 *                - email
 *                - password
      *         properties:
      *           email:
      *             description: "The Users email."
      *             type: string
      *             format: email
      *           first_name:
      *             description: "The name of the User."
      *             type: string
      *           last_name:
      *             description: "The name of the User."
      *             type: string
      *           phone:
      *             description: "The phone number of the User."
      *             type: string
      *           user_name:
      *             description: "The user name of the User."
      *             type: string
      *           custom_role:
      *             description: "Userrole assigned to the user."
      *             type: string
      *             enum: [admin, member, developer, vendor]
      *           password:
      *             description: "The Users password."
      *             type: string
      *             format: password
 *           payments:
 *             description: Payments to associate the Vendor with.
 *             type: array
 *             items:
 *               required:
 *                 - payment_type
 *                 - payment_name
 *                 - account_holder
 *               properties:
 *                 payment_type:
 *                   description: The type of Payment.
 *                   type: string
 *                 payment_name:
 *                   description: The name of Payment.
 *                   type: string
 *                 account_holder:
 *                   description: The account holder of Payment.
 *                   type: string
 *                 wallet_number:
 *                   description: The wallet number value of Payment.
 *                   type: string
 *                 account_number:
 *                   description: The acount number value of Payment.
 *                   type: string
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/products' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
    "nrcno": "12/sakhana(n)123456",
    "primary_phone": "09123456789",
    "secondary_phone": "09123456789",
    "default_commission": 10,
    "store": {
        "name": "BT21",
        "store_type": "offical store",
        "seller_type": "retail",
        "state_division": "yangon",
        "city": "yangon",
        "township": "hlaing",
        "address" : "Near thanlan bus-stop, MTP Condo"
    },
    "user": {
        "email": "jkk11@gmail.com",
        "password": "supersecret"
    },
    "payments":[
        {
            "payment_type" : "wallet",
            "payment_name" : "kpay",
            "account_holder": "jjk",
            "wallet_number" : "0978999"
        },
        {
            "payment_type" : "mobile banking",
            "payment_name" : "kbz",
            "account_holder": "jjk",
            "account_number" : "0978999"
        }
    ]
}'
 * security:
 *   - api_token: []
 *   - cookie_auth: []
 * tags:
 *   - Vendor
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             product:
 *               $ref: "#/components/schemas/Vendor"
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
import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
    ValidateNested,
    IsNumber
  } from "class-validator"
import { MedusaError } from "medusa-core-utils";
import { VendorPaymentTypes } from "../entities/vendorPayment.entity";

import { EntityManager } from "typeorm";
import { Type } from "class-transformer"
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { VendorService } from "../services/vendor.service";
import { UserService } from "../../user/services/user.service";
import { AdminCreateUserRequest } from "../../user/handlers/create-user";
import { CustomUserRoles } from "../../user/entities/user.entity";
import { core_response } from "../../app/coreResponse";
import StoreService from "../../store/services/store.service";
import { SellerTypes, StoreTypes } from "../../store/entities/store.entity";
import { CreateStoreInput } from "../../store/types/store";

export default async (req, res) => {

    try {
        const vendorService: VendorService = req.scope.resolve(VendorService.resolutionKey);
        const userService: UserService = req.scope.resolve(UserService.resolutionKey);
        const storeService: StoreService = req.scope.resolve(StoreService.resolutionKey);
      
        const loggedInUserId = req.user.userId;
        const loginUser = await userService.retrieve(req.user.userId);
        
        //verify logged user must be admin. (admin user has not store_id)
        if(loginUser.store_id) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Access is denied.`
          )
        }

        const validated = await validator(AdminPostVendorReq, req.body)
      
        const entityManager: EntityManager = req.scope.resolve("manager")

        const newVendor = await entityManager.transaction(async (manager) => {
        let { user, store, payments } = validated
        delete validated.user;
        delete validated.store;

        //check request contain store infomation
        if(!store) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Store information must be provided`
          )
        }
        //check request contain user infomation
        if(!user) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `User information must be provided`
          )
        }
        
       //check request contain payment infomation
        if(payments.length == 0) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `Payment information must be provided`
          )
        }
        
      //check payment_type is consistent with its value(eg. if type is wallet, wallet_number must be provided)
      for(const payment of payments) {
          if(
            payment.payment_type == VendorPaymentTypes.MOBILE_BANKING &&
            !payment.account_number) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `account_number for payment type(${payment.payment_type}) must be provided`
              )
            }
            if(
              payment.payment_type == VendorPaymentTypes.WALLET &&
              !payment.wallet_number) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `wallet_number for payment type(${payment.payment_type}) must be provided`
                )
              }
        }
      const newStore = await storeService
                          .withTransaction(manager)
                          .createStore(store as CreateStoreInput);
        
      user.custom_role = CustomUserRoles.VENDOR;
      user.store_id = newStore.id;

      const newUser = await userService
                          .withTransaction(manager)
                          .create(user, loggedInUserId);
      
      const newVendor = await vendorService
                              .withTransaction(manager)
                              .create(validated, newUser.id);
      
     
        return newVendor
      })
    
      const rawVendor = await vendorService.retrieve(newVendor.id, {
        relations: ["user", "payments", "user.store"]
        })

        // const rawVendor = await vendorService.retrieve(newVendor.id, {
        //   select: defaultAdminVendorFields,
        //   relations: defaultAdminVendorRelations ,
        // })
      
      
       res.json({ rawVendor })
     
    } catch (e: any) {
      let data = { "type" : e.type, "message" : e.message};
        let result = core_response(e.type, data)
       
        res.status(result['code']).send(result['body']);
    }
  }

 export class AdminStorePostReq {
  @IsString()
  name: string

  @IsString()
  @IsOptional()
  store_logo: string

  @IsEnum(StoreTypes)
  store_type: StoreTypes

  @IsEnum(SellerTypes)
  seller_type: SellerTypes

  @IsString()
  state_division: string

  @IsString()
  city: string

  @IsString()
  township: string

  @IsString()
  address: string

 }

export class AdminVendorPaymentPostReq {
   
    @IsEnum(VendorPaymentTypes)
    payment_type: VendorPaymentTypes

    @IsString()
    payment_name: string

    @IsString()
    account_holder: string

    @IsString()
    @IsOptional()
    account_number?: string

    @IsString()
    @IsOptional()
    wallet_number?: string

    // @IsString()
    // @IsOptional()
    // vendor_id?: string

   
  }
  export class AdminPostVendorReq {

    @Type(() => AdminStorePostReq)
    @ValidateNested({ each: true })
    store: AdminStorePostReq

    @Type(() => AdminCreateUserRequest)
    @ValidateNested({ each: true })
    user: AdminCreateUserRequest


    @IsArray()
    @Type(() => AdminVendorPaymentPostReq)
    @ValidateNested({ each: true })
    payments: AdminVendorPaymentPostReq[] = []

    @IsString()
    nrcno: string
  
    @IsString()
    primary_phone: string
  
    @IsString()
    @IsOptional()
    secondary_phone?: string
  
    @IsNumber()
    default_commission: number
  }