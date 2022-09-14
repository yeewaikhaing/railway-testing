import { Module } from "medusa-extender";
import { Role } from "./role.entity";
import { RoleMigration1662296948124 } from './1662296948124-role.migration';
import { RoleRepository } from "./role.repository";

@Module({
  imports: [
    Role,
    RoleRepository,
    RoleMigration1662296948124
  ]
})
export class RoleModule {}