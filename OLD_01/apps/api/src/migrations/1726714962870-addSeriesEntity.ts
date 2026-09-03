import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSeriesEntity1726714962870 implements MigrationInterface {
    name = 'AddSeriesEntity1726714962870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "serie" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "serie" character varying NOT NULL, "values" character varying NOT NULL, "isFull" boolean NOT NULL DEFAULT true, "isWildcard" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_8c8f5d9ab9991a8b07a7b2726fa" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "serie"`);
    }

}
