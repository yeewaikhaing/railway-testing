import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CustomerMigration1663150921743 implements MigrationInterface {
    name = 'CustomerMigration1663150921743';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = '';
        await queryRunner.query(query);
    }
}