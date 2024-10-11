import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { RoomModule } from './room/room.module';
import { configService } from './config/config.service';
import { ConfigModule } from './config/config.module';
import { SeriesModule } from './serie/series.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist')
    }),
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    RoomModule,
    ConfigModule,
    SeriesModule,
    AuthModule,
    UsersModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
