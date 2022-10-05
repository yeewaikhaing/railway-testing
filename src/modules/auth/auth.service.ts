import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaAuthService} from '@medusajs/medusa/dist/services/auth';
import {  CustomerService } from '../customer/v1/services/customer.service';
//import { default as MedusaUserService} from '@medusajs/medusa/dist/services/user';
import  UserService  from '../user/services/user.service';
import { AuthenticateResult} from '@medusajs/medusa/dist/types/auth';
import { Customer } from '../customer/v1/entities/customer.entity';
import { User } from '../user/entities/user.entity';
 
type InjectedDependencies = {
    manager: EntityManager;
    customerService: CustomerService;
    userService: UserService;
};
@Service({scope: 'SCOPED', override: MedusaAuthService})
export class AuthService extends MedusaAuthService {
    static resolutionKey = 'authService';

    private readonly manager: EntityManager;
    private readonly custService: CustomerService;
    private readonly userService: UserService;

    constructor({ manager, userService, customerService }: InjectedDependencies) {
        //super(container);
        
        super({ manager, userService, customerService })
        this.manager = manager;
        this.custService = customerService;
        this.userService = userService;
    }
    /**
   * Authenticates a customer based on an email/phone, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} login_info - the email/phone of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), customer: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
    async authenticateCustomer(
        login_info: string,
        password: string
      ): Promise<AuthenticateResult> {
        return await this.atomicPhase_(async (transactionManager) => {
          try {
            // check login_info's value is phone?
            let isnum:boolean = /^\d+$/.test(login_info);
            if(! isnum) {// email
                    var customerPasswordHash: Customer = await this.custService  
                        .retrieveByEmail(login_info, {
                            select: ["password_hash"],
                        });  
                    if (customerPasswordHash.password_hash) {
                        const passwordsMatch = await this.comparePassword_(
                            password,
                            customerPasswordHash.password_hash
                        )
                
                        if (passwordsMatch) {
                            var customer = await this.custService
                            .withTransaction(transactionManager)
                            .retrieveByEmail(login_info)
                        }
                    }
            }
            else {//phone
                var customerPasswordHash: Customer = await this.custService  
                    .retrieveByPhone(login_info, {
                        select: ["password_hash"],
                    })   
                    if (customerPasswordHash.password_hash) {
                        const passwordsMatch = await this.comparePassword_(
                                password,
                                customerPasswordHash.password_hash
                            );
                
                        if (passwordsMatch) {
                            var customer = await this.custService
                            .withTransaction(transactionManager)
                            .retrieveByPhone(login_info)
                        }
                    }
                }  
            
                return {
                  success: true,
                  customer,
                }
              }
            catch (error) {
            // ignore
          }
    
          return {
            success: false,
            error: "Invalid email or password",
          }
        })
      }
       /**
   * Authenticates a user based on an email/phone, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} login_info - the email/phone of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), user: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
    async authenticate(
        login_info: string,
        password: string
      ): Promise<AuthenticateResult> {
        return await this.atomicPhase_(async (transactionManager) => {
          try {
            // check login_info's value is phone?
            let isnum:boolean = /^\d+$/.test(login_info);
            let user: any = '';
            if(! isnum) {// email
                    var userPasswordHash: User = await this.userService  
                        .retrieveByEmail(login_info, {
                            select: ["password_hash"],
                        });  
                    if (userPasswordHash.password_hash) {
                        const passwordsMatch = await this.comparePassword_(
                            password,
                            userPasswordHash.password_hash
                        )
                
                        if (passwordsMatch) {
                             user = await this.userService
                            .withTransaction(transactionManager)
                            .retrieveByEmail(login_info)
                        }
                    }
            }
            else {//phone
                var userPasswordHash: User = await this.userService  
                    .retrieveByPhone(login_info, {
                        select: ["password_hash"],
                    })   
                    if (userPasswordHash.password_hash) {
                        const passwordsMatch = await this.comparePassword_(
                                password,
                                userPasswordHash.password_hash
                            );
                
                        if (passwordsMatch) {
                            user = await this.custService
                            .withTransaction(transactionManager)
                            .retrieveByPhone(login_info)
                        }
                    }
                }  
            
                return {
                  success: true,
                  user,
                }
              }
            catch (error) {
            // ignore
          }
    
          return {
            success: false,
            error: "Bad credentials",
          }
        })
      }
}