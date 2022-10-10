
/**
 * @oas [get] /v1/admin/auth/username/{username}
 * summary: "Check if username exists"
 * description: "Checks if a User with the given username has signed up."
 * parameters:
 *   - in: path
 *     name: username
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            exists:
 *              type: boolean
 */
 import  {UserService}  from "../../../user/services/user.service"; 

export default async (req, res) => {
  const { user_name } = req.params

  try {
    const userService: UserService = req.scope.resolve(UserService.resolutionKey);
    
    const user = await userService.retrieveByUsername(user_name);

    res.status(200).json({ exists: true})
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}