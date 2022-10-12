import { BaseEntity } from "@medusajs/medusa";
import { Role } from "../role/role.entity";
export declare class Permission extends BaseEntity {
    name: string;
    metadata: Record<string, unknown>;
    roles: Role[];
    private beforeInsert;
}
