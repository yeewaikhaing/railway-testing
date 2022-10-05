
/**
 * @oas [get] /v1/admin/auth/email/{email}
 
 * summary: "Check if email exists"
 * description: "Checks if a User with the given email has signed up."
 * parameters:
 *   - in: path
 *     name: email
 *     schema:
 *       type: string
 *       format: email
 *     required: true
 *     description: The email to check if exists.
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            exists:
 *              type: boolean
 *              description: Whether email exists or not.
 */
import  UserService  from "../../../user/services/user.service"; 

export default async (req, res) => {
  const { email } = req.params

  try {
    const userService: UserService = req.scope.resolve(UserService.resolutionKey);
    
    const user = await userService.retrieveByEmail(email);
    
    res.status(200).json({ exists: true })
  } catch (err) {
    console.log("error", err);
    
    res.status(200).json({ exists: false })
  }
}