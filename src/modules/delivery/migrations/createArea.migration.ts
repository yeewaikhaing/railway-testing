import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CreateAreaMigration1665556631750 implements MigrationInterface {
    name = 'CreateAreaMigration1665556631750';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "delivery_area" 
        (
            "id" character varying NOT NULL, 
            "area_name" character varying NOT NULL,
            "city_id" character varying NOT NULL,
            "pricing_id" character varying,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE,
            UNIQUE("area_name", "city_id", "pricing_id")
        )`;
        
        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("delivery_area", ["id"]);

        await queryRunner.query(`
        ALTER TABLE "delivery_area" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a" 
        FOREIGN KEY ("city_id") REFERENCES "city"("id") 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE`
        );

        await queryRunner.query(`
        ALTER TABLE "delivery_area" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2b" 
        FOREIGN KEY ("pricing_id") REFERENCES "price_group"("id") 
        ON DELETE NO ACTION 
        ON UPDATE CASCADE`
        );
        
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("delivery_area", true);
    }

}