import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Room } from "../room/entities/room.entity";
import { DataSourceOptions } from "typeorm";

require('dotenv').config();

export function typeOrmModuleOptions(isProduction: boolean): TypeOrmModuleOptions {
    let options: TypeOrmModuleOptions = {
        type: 'postgres',

        host: process.env.POSTGRES_DB_HOST ? process.env.POSTGRES_DB_HOST : undefined,
        port: process.env.POSTGRES_DB_PORT ? parseInt(<string>process.env.POSTGRES_DB_PORT) : undefined,
        username: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : undefined,
        password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : undefined,
        database: process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : undefined,

        entities: [Room]
    }
    if (process.env.POSTGRES_URI !== undefined && process.env.POSTGRES_URI !== null) {
        options = { ...options, 'url': process.env.POSTGRES_URI };
    }
    else if (process.env.DATABASE_URL !== undefined && process.env.DATABASE_URL !== null) {
        options = { ...options, 'url': process.env.DATABASE_URL };
    }
    return options;
}

export function getOrmConfig(isProduction: boolean) {

    return {
        ...typeOrmModuleOptions(isProduction),

        migrationsTableName: "migrations",
        migrations: ["dist/migrations/*.js"],

        /* Note : it is unsafe to use synchronize: true for schema synchronization
           on production once you get data in your database. */

        synchronize: !isProduction,
        dropSchema: false,
    } as DataSourceOptions;
};
