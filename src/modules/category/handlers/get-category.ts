/**
 * @oas [get] /v1/admin/categories/{id}
 * description: "Retrieves the category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the category.
 *   - lang: Shell
 *     label: cURL
 *     source: |
 *       curl --location --request GET 'https://medusa-url.com/v1/admin/categories/{id}' \
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
 import { CategoryService } from "../services/category.service"; 
 import { Request, Response } from "express";
 
import { defaultAdminCategoryFields } from "../routes/category.router"; 
import { defaultAdminCategoryRelations } from "../routes/category.router"; 
import { Category } from "../entities/category.entity";

 export default async (req, res) => {
    const { id } = req.params
  
    const categoryService: CategoryService = req.scope.resolve(CategoryService.resolutionKey);
  
    const categories = await categoryService.findDescendants(id);
    res.json({categories});
    // const category = await categoryService.retrieve(id, {
    //   relations: defaultAdminCategoryRelations,
    //   select: defaultAdminCategoryFields,
    // })

    //res.json({ category })
  }
