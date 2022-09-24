import { Service } from 'medusa-extender';
import { EntityManager } from 'typeorm';
import { default as MedusaAuthService} from '@medusajs/medusa/dist/services/auth';
import {  CustomerService } from '../../customer/v1/services/customer.service';
import { default as MedusaUserService} from '@medusajs/medusa/dist/services/user';
import { AuthenticateResult} from '@medusajs/medusa/dist/types/auth';
import { Customer } from '../../customer/v1/entities/customer.entity';


type InjectedDependencies = {
    manager: EntityManager;
    customerService: CustomerService;
    userService: MedusaUserService;
};
@Service({override: MedusaAuthService})
export class AuthenticationService extends MedusaAuthService {
    static resolutionKey = 'authenticationService';

    private readonly manager: EntityManager;
    private readonly custService: CustomerService;
    private readonly userService: MedusaUserService;

    constructor(container: InjectedDependencies, private readonly config: any) {
        super(container);
        
        this.manager = container.manager;
        this.custService = container.customerService;
        this.userService = container.userService;
    }
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
}