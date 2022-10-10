import { MigrationInterface, QueryRunner } from 'typeorm';
import { Migration } from 'medusa-extender';

@Migration()
export class VendorPaymentMigration2665246091359 implements MigrationInterface {
    name = 'VendorPaymentMigration2665246091359';
    
    public async up(queryRunner: QueryRunner): Promise<void> {
        let query = `
        CREATE TABLE "vendor_payment" 
        (
            "id" character varying NOT NULL, 
            "payment_type" character varying NOT NULL,
            "payment_name" character varying NOT NULL,
            "account_holder" character varying NOT NULL,
            "account_number" character varying,
            "wallet_number" character varying,
            "vendor_id" character varying NOT NULL,
            "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), 
            "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
            "deleted_at" TIMESTAMP WITH TIME ZONE
        )`;

        await queryRunner.query(query);
    
        await queryRunner.createPrimaryKey("vendor_payment", ["id"]);

        await queryRunner.query(`
        ALTER TABLE "vendor_payment" ADD CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a" 
        FOREIGN KEY ("vendor_id") REFERENCES "vendor"("id") 
        ON DELETE CASCADE 
        ON UPDATE CASCADE`
        );
        
    }
    
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "vendor_payment" DROP CONSTRAINT "FK_80823b7ae866dc5acae2dac6d2a"`);
        await queryRunner.dropTable("vendor_payment", true);
    }
}