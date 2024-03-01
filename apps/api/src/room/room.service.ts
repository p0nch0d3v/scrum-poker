import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository, IsNull, Not } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JoinRoomDTO } from './dto/joinRoom.dto';
import { RoomDTO } from './dto/room.dto';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) { }

  async create(createRoomDto: CreateRoomDTO): Promise<string> {
    if (createRoomDto.password !== undefined
      && createRoomDto.password !== null
      && createRoomDto.password.trim().length > 0) {
      createRoomDto.password = await this.hashPassword(createRoomDto.password);
    }
    else {
      createRoomDto.password = null;
    }

    const room = await this.roomsRepository.create(createRoomDto);
    await this.roomsRepository.save(room);
    return room.id;
  }

  async exists(roomDto: JoinRoomDTO): Promise<boolean> {
    const savedRoom = await this.roomsRepository.findOne({
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

  async hasPassword(id: string): Promise<boolean> {
    return await this.roomsRepository.exists({
      where: {
        id: id,
        password: Not(IsNull())
      }
    });
  }

  async getByUniqueId(id: string): Promise<RoomDTO> {
    const savedRoom = await this.roomsRepository.findOne({
      where: {
        id: id
      }
    });

    return new RoomDTO(savedRoom.id, savedRoom.name, savedRoom.password !== undefined && savedRoom.password !== null && savedRoom.password.length > 0);
  }

  async getAll(): Promise<Array<RoomDTO>> {
    const rooms = await this.roomsRepository
      .createQueryBuilder('room')
      .select(['room.id', 'room.name'])
      .addSelect("password is not NULL", "room_hasPassword")
      .getRawMany();
    const allRooms = [];
    rooms.forEach(room => {
      allRooms.push(new RoomDTO(room.room_id, room.room_name, room.room_hasPassword));
    });
    return allRooms;
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}
