import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AddDefaultCommissionToVendorMigration1666200511895 implements MigrationInterface {
    name = 'AddDefaultCommissionToVendorMigration1666200511895';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE "vendor" ADD COLUMN IF NOT EXISTS "default_commission" float not null;`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(` ALTER TABLE "vendor" DROP COLUMN "default_commission";`);
    }
}