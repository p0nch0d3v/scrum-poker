import { Module } from '@nestjs/common';
import { RoomService } from './room.service';
import { RoomController } from './room.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { SocketGateway } from './socket.gateway';
import { SocketService } from './socket.service';

@Module({
  imports: [TypeOrmModule.forFeature([Room])],
  exports: [TypeOrmModule],
  controllers: [RoomController],
  providers: [RoomService, SocketGateway, SocketService]
})
export class RoomModule {}
