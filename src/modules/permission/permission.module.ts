import { Module } from "medusa-extender";
import { Permission } from "./permission.entity";
import { PermissionMigration1662297363988 } from "./1662297363988-permission.migration";
import { PermissionRepository } from "./permission.repository";

@Module({
  imports: [
    Permission,
    PermissionRepository,
    PermissionMigration1662297363988
  ]
})
export class PermissionModule {}