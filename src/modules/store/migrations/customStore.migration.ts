import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CustomStoreMigration1665451262975 implements MigrationInterface {
    name = 'CustomStoreMigration1665451262975';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "store_logo" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "store_type" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "seller_type" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "state_division" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "city" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "township" character varying`);
        await queryRunner.query(`ALTER TABLE public."store" ADD COLUMN IF NOT EXISTS "address" text`);
       // await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "shop_type"`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "store_logo"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "store_type"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "seller_type"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "state_division"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "city"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "township"`);
        await queryRunner.query(`ALTER TABLE public."store" DROP COLUMN "address"`);
    }
}