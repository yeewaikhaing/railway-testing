
/**
 * @oas [delete] /v1/admin/categories/{id}
 * description: "Deletes the category."
 * x-authenticated: true
 * parameters:
 *   - (path) id=* {string} The ID of the category.
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
 *               description: The ID of the deleted category
 *             object:
 *               type: string
 *               description: The type of the object that was deleted.
 *               default: category
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
 import { core_response } from "../../app/coreResponse";
 import { EntityManager } from "typeorm"
 import { CategoryService } from "../services/category.service" 
 
export default async (req: Request, res: Response): Promise<void> => {
  try {
      const { id } = req.params

      const categoryService: CategoryService = req.scope.resolve(
        CategoryService.resolutionKey
      );
      const manager: EntityManager = req.scope.resolve("manager")
      await manager.transaction(async (transactionManager) => {
        return await categoryService
          .withTransaction(transactionManager)
          .delete(id)
      })

      res.json({
        id,
        object: "category",
        deleted: true,
      })
  } catch (e: any) {
    let data = { "type" : e.type, "message" : e.message};
      let result = core_response(e.type, data)
     
      res.status(result['code']).send(result['body']);
  }
}