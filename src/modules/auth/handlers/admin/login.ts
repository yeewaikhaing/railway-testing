/**
 * @oas [post] /admin/v1/auth
 * summary: "Authenticate a User"
 * x-authenticated: false
 * description: "Logs a User in and authorizes them to manage Store settings."
 * parameters:
 *   - (body) login_id=* {string} The User's email or phone.
 *   - (body) password=* {string} The User's password.
 * tags:
 *   - Auth
 * responses:
 *  "200":
 *    description: OK
 *    content:
 *      application/json:
 *        schema:
 *          properties:
 *            user:
 *              $ref: "#/components/schemas/user"
 */
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { AuthService } from "../../auth.service";
import { EntityManager } from "typeorm";
import jwt from "jsonwebtoken";
//import  UserService  from "../../../user/services/user.service"; 
import {  IsNotEmpty, IsString } from "class-validator";
import _ from "lodash";

export default async (req, res) => {
    const validated = await validator(AdminPostAuthReq, req.body)
  
    //const authService: MyAuthService = req.scope.resolve("myService");
    const authService: AuthService = req.scope.resolve(AuthService.resolutionKey);
    const manager: EntityManager = req.scope.resolve("manager");
    const result = await manager.transaction(async (transactionManager) => {
      return await authService
        .withTransaction(transactionManager)
        .authenticate(validated.login_id,validated.password )
        
    })
  
    if(result.success && result.user) {
        // Add JWT to cookie
        const {
            projectConfig: { jwt_secret },
          } = req.scope.resolve("configModule");

        req.session.jwt = jwt.sign({ userId: result.user.id }, jwt_secret, {
            expiresIn: "24h",
        })
    
        const cleanRes = _.omit(result.user, ["password_hash"])
    
        res.json({ user: cleanRes })
    }
    else{
        res.sendStatus(401)
    }

  }
  export class AdminPostAuthReq {
    @IsNotEmpty()
    @IsString()
    login_id: string
  
    @IsNotEmpty()
    @IsString()
    password: string
  }