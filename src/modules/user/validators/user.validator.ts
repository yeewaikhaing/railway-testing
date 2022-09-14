import { Validator } from 'medusa-extender';
import { AdminCreateUserRequest } from '@medusajs/medusa/dist/api/routes/admin/users/create-user';
import { IsString } from 'class-validator';

@Validator({ override: AdminCreateUserRequest })
export class UserValidator extends AdminCreateUserRequest { 
  @IsString()
  phone: string;
}