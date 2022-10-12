
/**
 * @oas [get] /v1/admin/auth/phone/{phone}
 * description: "Checks if a User with the given phone has signed up."
 * parameters:
 *   - in: path
 *     name: phone
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
  const { phone } = req.params

  try {
    const userService: UserService = req.scope.resolve(UserService.resolutionKey);
    
    const user = await userService.retrieveByPhone(phone);
    
    res.status(200).json({ exists: true })
  } catch (err) {
    res.status(200).json({ exists: false })
  }
}