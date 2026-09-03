import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSerieValueToRoom1727581028838 implements MigrationInterface {
    name = 'AddSerieValueToRoom1727581028838'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ADD "serie" character varying`);
        await queryRunner.query(`ALTER TABLE "room" ADD "values" character varying`);
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "cards" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" ALTER COLUMN "cards" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "values"`);
        await queryRunner.query(`ALTER TABLE "room" DROP COLUMN "serie"`);
    }

}
