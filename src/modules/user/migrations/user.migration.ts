import { Migration } from 'medusa-extender';
import { MigrationInterface, QueryRunner } from 'typeorm';

@Migration()
export default class addStoreIdToUser1644946220402 implements MigrationInterface {
    name = 'addStoreIdToUser1644946220402';

    public async up(queryRunner: QueryRunner): Promise<void> {
      const query = 
      `
          ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "store_id" text;
          ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "phone" character varying;
          ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "email_verified_at" TIMESTAMP WITH TIME ZONE;
          ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "phone_verified_at" TIMESTAMP WITH TIME ZONE;
      `;
      await queryRunner.query(query);
      
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      const query = `
          ALTER TABLE public."user" DROP COLUMN "store_id";
          ALTER TABLE public."user" DROP COLUMN "phone";
          ALTER TABLE public."user" DROP COLUMN "email_verified_at";
          ALTER TABLE public."user" DROP COLUMN "phone_verified_at";
      `;
      await queryRunner.query(query);
      
    }
}