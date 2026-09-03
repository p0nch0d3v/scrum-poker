import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configService } from './config/config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const corsOrigin = configService.getCorsOrigin();
  const isProduction = configService.isProduction();
  const appPort = configService.getAppPort();

  app.setGlobalPrefix('api');
  app.enableCors({ origin: corsOrigin, methods: "GET,HEAD,POST", });
  await app.listen(isProduction ? 80 : appPort);
}
bootstrap();
