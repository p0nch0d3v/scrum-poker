import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RoomsModule } from './rooms/rooms.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../..', 'client', 'dist')
    }),
    RoomsModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
