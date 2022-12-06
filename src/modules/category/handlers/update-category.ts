
/**
 * @oas [post] /admin/v1/categories/{id}
 * description: "Update a category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the category.
 * requestBody:
 *   content:
 *     application/json:
 *       schema:
 *         properties:
 *           name:
 *             type: string
 *             description: Name of the category.
 *           parent_id:
 *             type: string
 *             description:  Parent id of the category.
 *           is_disabled:
 *             type: boolean
 *             description:  Indication of if the category is active.
 
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request POST 'https://medusa-url.com/admin/sales-channels/{id}' \
 *       --header 'Authorization: Bearer {api_token}' \
 *       --header 'Content-Type: application/json' \
 *       --data-raw '{
 *           "name": "App"
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
 *             price_group:
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
 import {IsBoolean,  IsOptional, IsString } from "class-validator"
 import { Request, Response } from "express"
 import { core_response } from "../../app/coreResponse";
 import { CategoryService } from "../services/category.service" 
 import { EntityManager } from "typeorm"
import { Category } from "../entities/category.entity";
import { MedusaError } from "medusa-core-utils";

export default async (req: Request, res: Response) => {
  try {
      const { id } = req.params
      const { validatedBody } = req as {
        validatedBody: AdminPostCategoryCategoryReq
      }

      const categoryService: CategoryService = req.scope.resolve(
        CategoryService.resolutionKey
      );
      const manager: EntityManager = req.scope.resolve("manager");

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
      // update category
      const category = await manager.transaction(
        async (transactionManager) => {
          return await categoryService
            .withTransaction(transactionManager)
            .update(id, validatedBody)
        }
      )

      res.status(200).json({ category })
    } catch (e: any) {
      let data = { "type" : e.type, "message" : e.message};
        let result = core_response(e.type, data)
       
        res.status(result['code']).send(result['body']);
    }
}

export class AdminPostCategoryCategoryReq {
    @IsString()
    @IsOptional()
    name?: string
  
    
    @IsOptional()
    parent?: Category

    @IsBoolean()
    @IsOptional()
    is_disabled?: boolean
  
  }
