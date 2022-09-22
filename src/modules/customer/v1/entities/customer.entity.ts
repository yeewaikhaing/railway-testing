import { 
    Column, 
    Entity, 
    Timestamp
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Customer as MedusaCustomer } from "@medusajs/medusa";

@MedusaEntity({override: MedusaCustomer})
@Entity()
export class Customer extends MedusaCustomer{
    @Column({nullable: true})
    user_name: string;

    @Column({default: true})
    status: boolean;

    @Column({nullable: true,type: "time with time zone"})
    phone_verified_at: Timestamp;

    @Column({nullable: true,type: "time with time zone"})
    email_verified_at: Timestamp;

    @Column({default : new Date(),type: "time with time zone"})
    join_date: Timestamp;
}