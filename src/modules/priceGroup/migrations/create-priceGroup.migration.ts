import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CreatePriceGroupMigration1664100391671 implements MigrationInterface {
    name = 'CreatePriceGroupMigration1664100391671';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "price_group" 
        (
            "id" character varying NOT NULL, 
            "name" character varying NOT NULL,
            "price" float NOT NULL DEFAULT 0,
            "is_disabled" boolean NOT NULL DEFAULT FALSE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("price_group", ["id"]);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("price_group", true);
    }
}