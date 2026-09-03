import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminToRoomm1718399878107 implements MigrationInterface {
    name = 'AddAdminToRoomm1718399878107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "admin" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "admin"`);
    }

}
