import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CreatePriceGroupMigration1664100391673 implements MigrationInterface {
    name = 'CreatePriceGroupMigration1664100391673';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "pricing_group" 
        (
            "id" character varying NOT NULL, 
            "name" character varying NOT NULL UNIQUE,
            "price" float NOT NULL DEFAULT 0,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("pricing_group", ["id"]);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("pricing_group", true);
    }
}