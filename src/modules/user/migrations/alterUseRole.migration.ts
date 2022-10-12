import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AlterUseRoleMigration1665272475853 implements MigrationInterface {
    name = 'AlterUseRoleMigration1665272475853';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`ALTER TYPE public.user_role_enum ADD VALUE 'vendor';`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
}