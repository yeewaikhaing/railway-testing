/**
 * @oas [post] /v1/admin/categories
 * description: "Creates a Category."
 * x-authenticated: true
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         required:
 *           - name
 *           - pa
 *         properties:
 *           name:
 *             description: The name of the category
 *             type: string
 *           parent_id:
 *             description: The parent id of the category
 *             type: string
 
 * x-codeSamples:
 *   - lang: JavaScript
 *     label: JS Client
 *     source: |
 *       import Medusa from "@medusajs/medusa-js"
 *       const medusa = new Medusa({ baseUrl: MEDUSA_BACKEND_URL, maxRetries: 3 })
 *       // must be previously logged in or use api token
 *       medusa.admin.salesChannels.create({
 *         name: 'App',
 *         description: 'Mobile app'
 *       })
 *       .then(({ price_group }) => {
 *         console.log(price_group.id);
 *       });
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App",
 *          "parent_id" : cat_1111111
 *       }'
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
 *               $ref: "#/components/schemas/category"
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
 import { CreateCategoryInput } from "../types/category";
 import { CategoryService } from "../services/category.service";  
 import { EntityManager } from "typeorm" 
 import { Request, Response } from "express";
 import { IsString, IsBoolean, IsOptional} from "class-validator"
 import { core_response } from "../../app/coreResponse";
 import { MedusaError } from "medusa-core-utils";
import { Category } from "../entities/category.entity";

  export default async (req: Request, res: Response) => {
     try {
         const validatedBody = req.validatedBody as CreateCategoryInput;

         const categoryService: CategoryService = req.scope.resolve(CategoryService.resolutionKey);
         const manager: EntityManager = req.scope.resolve("manager")
    
         // check cateogry's parent id exists
        if(validatedBody.parent) {
          const existing = await categoryService.retrieve(validatedBody.parent.id).catch(() => undefined);
          if(!existing) {
            throw new MedusaError(
              MedusaError.Types.INVALID_DATA,
              "A category with the given parent Id does not exist."
            );
          } 
        }

       const category = await manager.transaction(async (transactionManager) => {
         return await categoryService
           .withTransaction(transactionManager)
           .create(validatedBody)
       })
     
      res.status(200).json({ category: category })
      
     } catch (e: any) {
       let data = { "type" : e.type, "message" : e.message};
         let result = core_response(e.type, data)
        
         res.status(result['code']).send(result['body']);
     }
   }
   
   export class AdminPostCategoryReq {
     @IsString()
     name: string
   
     @IsOptional()
     parent?: Category
 
     @IsBoolean()
     @IsOptional()
     is_disabled?: boolean
   
   }