import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';
import { TableForeignKey } from 'typeorm';

@Migration()
export class CreateProductCategoryMigration1665823147868 implements MigrationInterface {
    name = 'CreateProductCategoryMigration1665823147868';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.query(`
            CREATE TABLE "product_category" 
            (
                "product_id" character varying NOT NULL, 
                "category_id" character varying NOT NULL,
                "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
            )`
            );
    
        await queryRunner.createPrimaryKey("product_category", ["product_id", "category_id"])
    
        await queryRunner.createForeignKey("product_category", new TableForeignKey({
            columnNames: ["product_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "product",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
    
        await queryRunner.createForeignKey("product_category", new TableForeignKey({
            columnNames: ["category_id"],
            referencedColumnNames: ["id"],
            referencedTableName: "category",
            onDelete: "CASCADE",
            onUpdate: "CASCADE"
        }));
        await queryRunner.query(
            `CREATE INDEX "IDX_5a4d5e1e60f97633547821ec8d" ON "product_category" ("product_id") `
        );
        await queryRunner.query(
            `CREATE INDEX "IDX_37341bad297fe5cca91f921032" ON "product_category" ("category_id") `
        );
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        
        await queryRunner.dropTable("product_category", true);
    }
}