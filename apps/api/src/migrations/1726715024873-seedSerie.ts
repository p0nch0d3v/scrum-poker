import { MigrationInterface, QueryRunner } from "typeorm";

export class SeedSerie1726715024873 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        let name = 'Fibonacci';
        let serie = '1,2,3,5,8,13,21';
        let values = '1,2,3,5,8,13,21';
        let query = `INSERT INTO serie (name, serie, "values", "isFull", "isWildcard")
                SELECT '${name}', '${serie}', '${values}', true, false
                WHERE NOT EXISTS (SELECT * FROM serie WHERE name = '${name}');`;
        await queryRunner.query(query,)

        name = 'T-Shirt';
        serie = 'XS,S,M,L,XL';
        values = '1,2,3,4,5';
        query = `INSERT INTO serie (name, serie, "values", "isFull", "isWildcard")
                SELECT '${name}', '${serie}', '${values}', true, false
                WHERE NOT EXISTS (SELECT * FROM serie WHERE name = '${name}');`;
        await queryRunner.query(query,)

        name = 'Wildcard';
        serie = '☕️,?,♾️,-';
        values = '☕️,?,♾️,null';
        query = `INSERT INTO serie (name, serie, "values", "isFull", "isWildcard")
                SELECT '${name}', '${serie}', '${values}', false, true
                WHERE NOT EXISTS (SELECT * FROM serie WHERE name = '${name}');`;
        await queryRunner.query(query,)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
