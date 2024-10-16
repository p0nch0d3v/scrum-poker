import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserEntity1729046542663 implements MigrationInterface {
    name = 'AddUserEntity1729046542663'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "google_user" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "email" character varying NOT NULL, "picture" character varying, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "google_user"`);
    }

}
