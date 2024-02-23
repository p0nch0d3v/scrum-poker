import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomssRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto) {
    const room = await this.roomssRepository.create(createRoomDto);
    await this.roomssRepository.save(room);
  }

}
