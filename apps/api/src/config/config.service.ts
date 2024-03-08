import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { getOrmConfig } from './orm.config';

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
        const value = node_env == 'production' || (node_env != 'development' && node_env != 'local');
        console.debug('is Production =', value);
        return value;
    }

    public getTypeOrmConfig(): TypeOrmModuleOptions {
        return getOrmConfig(this.isProduction());
    }
}

const configService = new ConfigService(process.env)
    .ensureValues([
        'NODE_ENV',
        'POSTGRES_HOST',
        'POSTGRES_PORT',
        'POSTGRES_USER',
        'POSTGRES_PASSWORD',
        'POSTGRES_DATABASE',
        'POSTGRES_URI'
    ]);

export { configService };