
/**
 * @oas [get] /admin/v1/vendors

 * summary: "List Vendors"
 * description: "Retrieves all Vendors."
 * x-authenticated: true
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
 *                 $ref: "#/components/schemas/vendor"
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
 import { CustomUserRoles } from "../../user/entities/user.entity";
import { UserService } from "../../user/services/user.service";
 
export default async (req, res) => {
  const loggedInUserId = req.user.userId;
  const userService: UserService = req.scope.resolve(UserService.resolutionKey);
  
  let listConfig = req.listConfig
  let filterableFields = req.filterableFields

  filterableFields.custom_role = CustomUserRoles.VENDOR;

  const [users, count] = await userService.listAndCount(
    loggedInUserId,
    filterableFields,
    listConfig
  )

    // const [users, count] = await userService.listAndCount( {
    //   relations: defaultAdminUsersRelations,
    //   select: defaultAdminUsersFields,
    // })
    res.status(200).json({
      vendors: users,
      count,
      offset: listConfig.skip,
      limit: listConfig.take,
    })

//   const user = await userService.retrieve(user_id, {
//     relations: defaultAdminUsersRelations,
//     select: defaultAdminUsersFields,
//   })
 // res.status(200).json({ users })
}
