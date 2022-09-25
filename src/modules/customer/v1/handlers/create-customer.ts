import  {CustomerService } from "../services/customer.service"
import { EntityManager } from "typeorm";
import { validator } from "@medusajs/medusa/dist/utils/validator";
import { IsEmail, IsOptional, IsString } from "class-validator"
import { Customer } from "../entities/customer.entity";
import jwt from "jsonwebtoken";
import { defaultStoreCustomersFields } from "../routers/customer.router";
import { defaultStoreCustomersRelations } from "../routers/customer.router";
import { core_response } from "../../../app/coreResponse";
export default async (req, res) => {
    //let 
    try {
        const validated = await validator(StorePostCustomersReq, req.body)
        const customerService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
        const manager: EntityManager = req.scope.resolve("manager");
       let customer: Customer = await manager.transaction(
        async (transactionManager) => {
          return await customerService
                       .create(validated);
        }
      )
    
    //Add JWT to cookie
    const {
        projectConfig: { jwt_secret },
    } = req.scope.resolve("configModule")
    req.session.jwt = jwt.sign({ customer_id: customer.id }, jwt_secret!, {
        expiresIn: "30d",
    })

    customer = await customerService.retrieve(customer.id, {
        relations: defaultStoreCustomersRelations,
        select: defaultStoreCustomersFields,
      })
    
      res.status(200).json({ customer });
    } catch (e: any) {
        let data = { "type" : e.type, "message" : e.message};
        let result = core_response(e.type, data)
       
        res.status(result['code']).send(result['body']);
       
    }
    
}

export class StorePostCustomersReq {
    @IsString()
    first_name: string
  
    @IsString()
    last_name: string
  
    @IsEmail()
    email: string
  
    @IsString()
    password: string
  
    @IsOptional()
    @IsString()
    phone?: string

    @IsOptional()
    @IsString()
    user_name?: string
  }