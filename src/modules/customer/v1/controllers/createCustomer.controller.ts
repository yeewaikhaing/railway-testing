import { CustomerService } from "../services/customer.service"
import { EntityManager } from "typeorm";
import { MedusaError } from "medusa-core-utils";

export default async (req, res) => {
    const custService: CustomerService = req.scope.resolve(CustomerService.resolutionKey);
    const manager: EntityManager = req.scope.resolve("manager");

    await manager.transaction( async(m) => {

        let email = req.body.email;
        if(email === undefined){
            let data = {
                "code" : 401,
                "message" : "email is required"
            };
            res.status(401).send(data);
        }
        const existing = await custService.retrieveByEmail(email).catch(() => undefined)

        if (existing && existing.has_account) {
            let data = {
                "code" : 401,
                "message" : "A customer with the given email already has an account. Log in instead"
            };
            res.status(401).send(data);
        }   
          
       const customer = await custService.withTransaction(m).create(req.body);
       
       res.status(200).send(customer);
       //res.sendStatus(200);
    })
}
