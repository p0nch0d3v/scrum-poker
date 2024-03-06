import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Room } from "src/room/entities/room.entity";

require('dotenv').config();

export function typeOrmModuleOptions(isProduction: boolean): TypeOrmModuleOptions {
    return {
        type: 'postgres',

        host: process.env.POSTGRES_DB_HOST ? process.env.POSTGRES_DB_HOST :  undefined,
        port: process.env.POSTGRES_DB_PORT ? parseInt(<string>process.env.POSTGRES_DB_PORT) : undefined,
        username: process.env.POSTGRES_USER ? process.env.POSTGRES_USER : undefined,
        password: process.env.POSTGRES_PASSWORD ? process.env.POSTGRES_PASSWORD : undefined,
        database: process.env.POSTGRES_DATABASE ? process.env.POSTGRES_DATABASE : undefined,

        url: process.env.POSTGRES_URI ? process.env.POSTGRES_URI : undefined,

        entities: [Room]
    };
}

export function getOrmConfig(isProduction: boolean) {
    return {
        ...typeOrmModuleOptions(isProduction),
        migrationsTableName: "migrations",
        migrations: ["src/migrations/*.ts"],
        cli: {
            "migrationsDir": "src/migrations"
        },

        /* Note : it is unsafe to use synchronize: true for schema synchronization
           on production once you get data in your database. */
        // synchronize: true,
        autoLoadEntities: !isProduction,
        synchronize: !isProduction
    };
};

