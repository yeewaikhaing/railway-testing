import { MigrationInterface, QueryRunner,TableForeignKey } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class VendorMigration2663150993315 implements MigrationInterface {
    name = 'VendorMigration2663150993315';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "vendor" 
        (
            "id" character varying NOT NULL, 
            "nrcno" character varying NOT NULL,
            "primary_phone" character varying NOT NULL,
            "secondary_phone" character varying,
            "initial_join_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "user_id" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("vendor", ["id"]);

        await queryRunner.query(`
        ALTER TABLE "vendor" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a" 
        FOREIGN KEY ("user_id") REFERENCES "user"("id") 
        ON DELETE NO ACTION 
        ON UPDATE NO ACTION`
        );
        
    }
    

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor" DROP CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a"`);
        await queryRunner.dropTable("vendor", true);
    }
}