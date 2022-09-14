import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class VendorMigration1663150993315 implements MigrationInterface {
    name = 'VendorMigration1663150993315';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
}