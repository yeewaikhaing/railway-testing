import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CustomizeAddressMigration1666686978988 implements MigrationInterface {
    name = 'CustomizeAddressMigration1666686978988';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."address" ADD COLUMN IF NOT EXISTS "label" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE public."address" ADD COLUMN IF NOT EXISTS "default_billing" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE public."address" ADD COLUMN IF NOT EXISTS "default_shipping" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE public."address" ADD COLUMN IF NOT EXISTS "delivery_area_id" character varying NOT NULL`);
       // await queryRunner.query(`ALTER TABLE public."address" ADD CONSTRAINT "UK_80823b7ae866dc5acae2dac6d2a" UNIQUE (customer_id,default_billing)`);
        await queryRunner.query(`
        ALTER TABLE public."address" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a" 
        FOREIGN KEY ("delivery_area_id") REFERENCES "delivery_area"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE`
        );

    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        //await queryRunner.query(`ALTER TABLE public."address" DROP CONSTRAINT "UK_80823b7ae866dc5acae2dac6d2a"`);
        await queryRunner.query(`ALTER TABLE public."address" DROP CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a"`);
        await queryRunner.query(`ALTER TABLE public."address" DROP COLUMN "label"`);
        await queryRunner.query(`ALTER TABLE public."address" DROP COLUMN "default_billing"`);
        await queryRunner.query(`ALTER TABLE public."address" DROP COLUMN "default_shipping"`);
        await queryRunner.query(`ALTER TABLE public."address" DROP COLUMN "delivery_area_id"`);
    }
}