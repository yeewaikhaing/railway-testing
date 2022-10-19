import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class AddCommisionToProductMigration1666119864595 implements MigrationInterface {
    name = 'AddCommisionToProductMigration1666119864595';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE public."product" ADD COLUMN IF NOT EXISTS "commission" float DEFAULT 0;`;
        await queryRunner.query(query);
      }
  
      public async down(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE public."product" DROP COLUMN "commission";`;
        await queryRunner.query(query);
      }
}