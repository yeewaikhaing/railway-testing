import { UserRepository as MedusaUserRepository } from "@medusajs/medusa/dist/repositories/user";
import { User } from "../entities/user.entity";
declare const UserRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<User>, MedusaUserRepository>;
export default class UserRepository extends UserRepository_base {
}
export {};
