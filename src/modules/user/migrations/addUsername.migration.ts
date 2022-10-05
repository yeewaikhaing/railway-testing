import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AddUsernameMigration1664964311259 implements MigrationInterface {
    name = 'AddUsernameMigration1664964311259';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "user_name" character varying;`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE public."user" DROP COLUMN "user_name";`);
    }
}