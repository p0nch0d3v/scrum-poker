import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoomModule } from './room/room.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist')
    }),
    RoomModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
