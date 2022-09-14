import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';
import { TableForeignKey } from 'typeorm';

@Migration()
export class UserMigration1662297001052 implements MigrationInterface {
    name = 'UserMigration1662297001052';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE public."user" ADD COLUMN IF NOT EXISTS "role_id" text;`;
        await queryRunner.query(query);
    
      await queryRunner.createForeignKey("user", new TableForeignKey({
          columnNames: ["role_id"],
          referencedColumnNames: ["id"],
          referencedTableName: "role",
          onDelete: "CASCADE",
          onUpdate: "CASCADE"
      }))
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        const query = `ALTER TABLE public."user" DROP COLUMN "role_id";`;
        await queryRunner.query(query);
    }
}