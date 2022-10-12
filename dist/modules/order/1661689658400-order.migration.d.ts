import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class OrderMigration1661689658400 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
