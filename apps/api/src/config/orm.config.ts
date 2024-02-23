import { TypeOrmModuleOptions } from "@nestjs/typeorm";

require('dotenv').config();

export const typeOrmModuleOptions: TypeOrmModuleOptions = {
    type: 'postgres',

    host: process.env.POSTGRES_DB_HOST,
    port: parseInt(<string>process.env.POSTGRES_DB_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,

    entities: [ __dirname + '**/*.entity{.ts,.js}' ]
};

export function getOrmConfig(isProduction: boolean) {
    return {
        ...typeOrmModuleOptions,
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

