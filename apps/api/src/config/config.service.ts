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

    public getGitRev(): string {
        const git_rev = this.getValue("GIT_REV");

        if (git_rev !== undefined && git_rev !== null) {
            return git_rev;
        }
        else {
            const current_branch = execSync("git rev-parse --abbrev-ref HEAD").toString();
            return current_branch !== undefined && current_branch !== null ? current_branch : "";
        }
    }
}

const configService = new ConfigService(process.env)
    .ensureValues([
        'NODE_ENV',
        'MODE',
        'SOCKET_SERVER',
        'APP_PORT',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
        'POSTGRES_URI', 
        'GIT_REV'
    ]);

export { configService };