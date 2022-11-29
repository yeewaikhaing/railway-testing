import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CustomizedPaymentMigration1669710778816 implements MigrationInterface {
    name = 'CustomizedPaymentMigration1669710778816';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."payment" ADD COLUMN IF NOT EXISTS "payment_type" character varying`);
        await queryRunner.query(`ALTER TABLE public."payment" ADD COLUMN IF NOT EXISTS "payment_proof" character varying`);
        await queryRunner.query(`ALTER TABLE public."payment" ADD COLUMN IF NOT EXISTS "payment_transferred_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE public."payment" DROP COLUMN "payment_type"`);
        await queryRunner.query(`ALTER TABLE public."payment" DROP COLUMN "payment_proof"`);
        await queryRunner.query(`ALTER TABLE public."payment" DROP COLUMN "payment_transferred_at"`);
    }
}