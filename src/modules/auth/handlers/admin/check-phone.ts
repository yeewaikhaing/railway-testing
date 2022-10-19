
/**
 * @oas [get] /admin/v1/auth/phone/{phone}
 * description: "Checks if a User with the given phone has signed up."
 * parameters:
 *   - (path) phone=* {string} The phone number to check if exists. 
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