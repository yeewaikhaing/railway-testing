import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AddCustomRoleMigration1665300684812 implements MigrationInterface {
    name = 'AddCustomRoleMigration1665300684812';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "custom_role" user_role_enum DEFAULT 'member'::user_role_enum;`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE public."user" DROP COLUMN "custom_role";`);
    }
}