import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CategoryMigration1664599257452 implements MigrationInterface {
    name = 'CategoryMigration1664599257452';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "category" 
        (
            "id" character varying NOT NULL, 
            "name" character varying NOT NULL UNIQUE,
            "parent_id" character varying NOT NULL DEFAULT 0,
            "is_disabled" boolean NOT NULL DEFAULT FALSE,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("category", ["id"]);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("category", true);
    }
}