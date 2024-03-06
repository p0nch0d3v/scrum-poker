import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Room } from "src/room/entities/room.entity";

require('dotenv').config();

export function typeOrmModuleOptions(isProduction: boolean): TypeOrmModuleOptions {
    return {
        type: 'postgres',

        host: process.env.POSTGRES_DB_HOST,
        port: parseInt(<string>process.env.POSTGRES_DB_PORT),
        username: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DATABASE,

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

