import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AddAreaToCustomShippingMigration1669213443483 implements MigrationInterface {
    name = 'AddAreaToCustomShippingMigration1669213443483';
    
    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE public."custom_shipping_option" ADD COLUMN IF NOT EXISTS "delivery_area_id" character varying`);
        
        await queryRunner.query(`
        ALTER TABLE public."custom_shipping_option" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a" 
        FOREIGN KEY ("delivery_area_id") REFERENCES "delivery_area"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE`
        );
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."custom_shipping_option" DROP CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a"`);
        await queryRunner.query(`ALTER TABLE public."custom_shipping_option" DROP COLUMN "delivery_area_id"`);
    }
}