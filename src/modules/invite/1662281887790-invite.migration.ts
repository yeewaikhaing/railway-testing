import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class InviteMigration1662281887790 implements MigrationInterface {
    name = 'InviteMigration1662281887790';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `
            ALTER TABLE public."invite" ADD COLUMN IF NOT EXISTS "store_id" text; 
        `;
        await queryRunner.query(query);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = `
            ALTER TABLE public."invite" DROP COLUMN "store_id";
        `;
        await queryRunner.query(query);
    }
}