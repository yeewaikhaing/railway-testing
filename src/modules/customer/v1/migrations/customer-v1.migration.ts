import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CustomerV1Migration1663150921743 implements MigrationInterface {
    name = 'CustomerV1Migration1663150921743';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."customer" ADD COLUMN IF NOT EXISTS "user_name" character varying`);
        await queryRunner.query(`ALTER TABLE public."customer" ADD COLUMN IF NOT EXISTS "status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE public."customer" ADD COLUMN IF NOT EXISTS "email_verified_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE public."customer" ADD COLUMN IF NOT EXISTS "phone_verified_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE public."customer" ADD COLUMN IF NOT EXISTS "join_date" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."customer" DROP COLUMN "user_name"`);
        await queryRunner.query(`ALTER TABLE public."customer" DROP COLUMN "status"`);
        await queryRunner.query(`ALTER TABLE public."customer" DROP COLUMN "email_verified_at"`);
        await queryRunner.query(`ALTER TABLE public."customer" DROP COLUMN "phone_verified_at"`);
        await queryRunner.query(`ALTER TABLE public."customer" DROP COLUMN "join_date"`);
    }
}