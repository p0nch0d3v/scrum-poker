import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCreatedAtToRoomm1709923173741 implements MigrationInterface {
    name = 'AddCreatedAtToRoomm1709923173741'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "created_at"`);
    }

}
