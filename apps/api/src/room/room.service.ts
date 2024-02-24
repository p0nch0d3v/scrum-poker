import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RoomDTO } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomssRepository: Repository<Room>,
  ) {}

  async create(createRoomDto: CreateRoomDTO): Promise<string> {
    if (createRoomDto.password !== undefined && createRoomDto.password !== null) {
      createRoomDto.password = await this.hashPassword(createRoomDto.password);
    }
    const room = await this.roomssRepository.create(createRoomDto);
    await this.roomssRepository.save(room);
    return room.id;
  }

  async exists(roomDto: RoomDTO): Promise<boolean> {
    const savedRoom = await this.roomssRepository.findOne({
      where: {
        id: roomDto.id
      }
    });

    if (savedRoom !== undefined && savedRoom !== null) {
      if (savedRoom.password !== undefined && savedRoom.password !== null && roomDto.password !== undefined && roomDto.password !== null) {
        return bcrypt.compare(roomDto.password, savedRoom.password);
      }
      return true;
    }
    return false;
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}
