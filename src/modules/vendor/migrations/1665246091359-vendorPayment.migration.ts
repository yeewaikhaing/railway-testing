import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class VendorPaymentMigration1665246091359 implements MigrationInterface {
    name = 'VendorPaymentMigration1665246091359';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
}