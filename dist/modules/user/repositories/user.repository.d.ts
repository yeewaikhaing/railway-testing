import { UserRepository as MedusaUserRepository } from "@medusajs/medusa/dist/repositories/user";
import { FindManyOptions } from "typeorm";
import { User } from "../entities/user.entity";
import { Selector, ExtendedFindConfig } from "@medusajs/medusa/dist/types/common";
declare const UserRepository_base: import("medusa-extender").MixinReturnType<import("typeorm").Repository<User>, MedusaUserRepository>;
export default class UserRepository extends UserRepository_base {
    findWithRelations(relations?: (keyof User | string)[], idsOrOptionsWithoutRelations?: Omit<FindManyOptions<User>, "relations"> | string[]): Promise<[User[], number]>;
    findOneWithRelations(relations?: Array<keyof User>, optionsWithoutRelations?: Omit<FindManyOptions<User>, "relations">): Promise<User>;
    getFreeTextSearchResultsAndCount(q: string, options?: ExtendedFindConfig<User, Selector<User>>): Promise<[User[], number]>;
}
export {};
