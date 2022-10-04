import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class CategoryClosureMigration1664770918211 implements MigrationInterface {
    name = 'CategoryClosureMigration1664770918211';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "category_closure" 
            (
                "ancestor_id" character varying NOT NULL, 
                "descendant_id" character varying NOT NULL, 
                CONSTRAINT "PK_3e4ee55a233bef0e3464728cc15" PRIMARY KEY ("ancestor_id", "descendant_id")
            )
        `);
        await queryRunner.query('CREATE INDEX "IDX_f23b3abb6caa54454a2a72da59" ON "category_closure" ("ancestor_id") ');
        await queryRunner.query('CREATE INDEX "IDX_276148abd382d667072d533af4" ON "category_closure" ("descendant_id") ');


    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("category_closure", true);
        await queryRunner.query('DROP INDEX "IDX_276148abd382d667072d533af4"');
        await queryRunner.query('DROP INDEX "IDX_f23b3abb6caa54454a2a72da59"');
    }
}