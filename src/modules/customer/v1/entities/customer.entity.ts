import { 
    Column, 
    Entity, 
    OneToMany, 
    Timestamp
} from "typeorm"; 
import { Entity as MedusaEntity } from "medusa-extender";
import { Customer as MedusaCustomer } from "@medusajs/medusa";
import { Address } from "./address.entity";

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

    @OneToMany(() => Address, (address: Address) => address.customer)
    addresses: Address[];
}

/**
 * @schema customer
 * title: "Customer"
 * description: "Represents a customer"
 * x-resourceId: customer
 * required:
 *   - email
 * properties:
 *   id:
 *     type: string
 *     description: The customer's ID
 *     example: cus_01G2SG30J8C85S4A5CHM2S1NS2
 *   email:
 *     type: string
 *     description: The customer's email
 *     format: email
 *   first_name:
 *     type: string
 *     description: The customer's first name
 *     example: Arno
 *   last_name:
 *     type: string
 *     description: The customer's first name
 *     example: Willms
 *   billing_address_id:
 *     type: string
 *     description: The customer's billing address ID
 *     example: addr_01G8ZH853YPY9B94857DY91YGW
 *   billing_address:
 *     description: Available if the relation `billing_address` is expanded.
 *     $ref: "#/components/schemas/address"
 *   shipping_addresses:
 *     description: Available if the relation `shipping_addresses` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/address"
 *   phone:
 *     type: string
 *     description: The customer's phone number
 *     example: 16128234334802
 *   has_account:
 *     type: boolean
 *     description: Whether the customer has an account or not
 *     default: false
 *   orders:
 *     description: Available if the relation `orders` is expanded.
 *     type: array
 *     items:
 *       type: object
 *       description: An order object.
 *   groups:
 *     description: The customer groups the customer belongs to. Available if the relation `groups` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/customer_group"
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   deleted_at:
 *     type: string
 *     description: "The date with timezone at which the resource was deleted."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */