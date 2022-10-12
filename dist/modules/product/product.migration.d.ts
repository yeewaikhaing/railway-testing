import { MigrationInterface, QueryRunner } from 'typeorm';
export default class addStoreIdToProduct1645034402086 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
