import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class RoleMigration1662296948124 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
