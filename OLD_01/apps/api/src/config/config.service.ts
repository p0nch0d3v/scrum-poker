import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { execSync } from 'child_process';
import { getOrmConfig } from './orm.config';
import { Environments } from 'models';

require('dotenv').config();

class ConfigService {

    constructor(private env: { [k: string]: string | undefined }) { }

    private getValue(key: string, throwOnMissing = true): string {
        const value = this.env[key];
        if (!value && throwOnMissing) {
            console.error(`config error - missing env.${key}`)
        }
        console.debug(`[${key}]`, value)
        return value;
    }

    public ensureValues(keys: string[]) {
        keys.forEach(k => this.getValue(k, true));
        return this;
    }

    public getPort() {
        return this.getValue('PORT', true);
    }

    public isProduction(): boolean {
        const node_env = this.getValue('NODE_ENV', false);
        const value = node_env.toLocaleLowerCase() == Environments.PRODUCTION 
        || (
            node_env.toLocaleLowerCase() !== Environments.DEVELOPMENT 
            && node_env.toLocaleLowerCase() !== Environments.LOCAL);
        console.debug('is Production =', value);
        return value;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return getOrmConfig(this.isProduction());
    }

    public getEnvironment(): string {
        return this.getValue('NODE_ENV', false);
    }

    public getSocketServer(): string {
        return this.isProduction() === true ? "" : this.getValue("SOCKET_SERVER");
    }

    public getAppPort(): string {
        const app_port = this.getValue("APP_PORT");
        return app_port !== undefined && app_port !== null ? app_port : "80";
    }    

    public getCorsOrigin(): string {
        const cors_origin = this.getValue("CORS_ORIGIN");
        return cors_origin !== undefined && cors_origin !== null ? cors_origin : "*"; 
    }

    public getGoogleAuthClientId(): string {
        const value = this.getValue("GOOGLE_AUTH_CLIENT_ID");
        return value !== undefined && value !== null ? value : '';
    } 

    public getGooleAuthClientSecret(): string {
        const value = this.getValue("GOOGLE_AUTH_CLIENT_SECRET");
        return value !== undefined && value !== null ? value : '';
    }
}

const configService = new ConfigService(process.env)
    .ensureValues([
        'NODE_ENV',
        'MODE',
        'SOCKET_SERVER',
        'APP_PORT',
        'CORS_ORIGIN',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
        'POSTGRES_URI',
        'GOOGLE_AUTH_CLIENT_ID',
        'GOOGLE_AUTH_CLIENT_SECRET'
    ]);

export { configService };
