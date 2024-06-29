import { Controller, Get } from '@nestjs/common';
import { get } from 'http';
import { configService } from './config.service';
import { ServerConfigDTO } from 'models';

@Controller('config')
export class ConfigController {
    @Get('all')
    getConfig(): ServerConfigDTO {
        return {
            environment: configService.getEnvironment(),
            isProduction: configService.isProduction(),
            socketServer: configService.getSocketServer()
        }
    }
}
