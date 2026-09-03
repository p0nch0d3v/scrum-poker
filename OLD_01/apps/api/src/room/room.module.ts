import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';
import { SeriesModule } from 'src/serie/series.module';
import { SerieService } from 'src/serie/seire.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room]), SeriesModule],
  exports: [TypeOrmModule],
  controllers: [RoomController],
  providers: [RoomService, SocketGateway, SocketService, SerieService]
})
export class RoomModule {}
