import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomssRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDto): Promise<string> {
    if (createRoomDto.password != undefined) {
      createRoomDto.password = await bcrypt.hash(createRoomDto.password, 10);
    }
    const room = await this.roomssRepository.create(createRoomDto);
    await this.roomssRepository.save(room);
    return room.id;
  }

}
