import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CreateCityMigration1665535795090 implements MigrationInterface {
    name = 'CreateCityMigration1665535795090';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "city" 
        (
            "id" character varying NOT NULL, 
            "city_name" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("city", ["id"]);

    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("city", true);
    }
}