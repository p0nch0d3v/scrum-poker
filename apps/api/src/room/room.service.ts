import { Injectable } from '@nestjs/common';
import { CreateRoomDTO } from './dto/create-room.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository, IsNull, Not, SelectQueryBuilder } from 'typeorm';
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
    if (!this.validateUUID(roomDto.id)) {
      return false;
    }

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
    if (!this.validateUUID(id)) {
      return false;
    }

    return await this.roomsRepository.exists({
      where: {
        id: id,
        password: Not(IsNull())
      }
    });
  }

  async getByUniqueId(id: string): Promise<RoomDTO> {
    if (!this.validateUUID(id)) {
      return null;
    }

    const savedRoom = await this.roomsRepository.findOne({
      where: {
        id: id
      }
    });

    savedRoom

    return (savedRoom !== undefined && savedRoom !== null) ? new RoomDTO(savedRoom.id,
      savedRoom.name,
      savedRoom.cards,
      savedRoom.created_at,
      savedRoom.password !== undefined && savedRoom.password !== null && savedRoom.password.length > 0)
      : null;
  }

  async getAll(): Promise<Array<RoomDTO>> {
    const rooms =  await (await this.query()).getRawMany();
    const allRooms = [];
    rooms.forEach(room => {
      allRooms.push(new RoomDTO(room.room_id, room.room_name, room.room_cards, room.room_created_at, room.room_hasPassword));
    });
    
    return allRooms;
  }

  async getCards(id: string): Promise<string> {
    const savedRoom = await this.getByUniqueId(id);
    if (savedRoom !== undefined && savedRoom !== null) {
      return savedRoom.cards;
    }
    return "";
  }

  async latest(): Promise<Array<RoomDTO>> {
    const rooms = await (await this.query()).take(10).getRawMany();
    const allRooms = [];
    rooms.forEach(room => {
      allRooms.push(new RoomDTO(room.room_id, room.room_name, room.room_cards, room.room_created_at, room.room_hasPassword));
    });
    return allRooms;
  }

  private async query(): Promise<SelectQueryBuilder<Room>> {
    return await this.roomsRepository
      .createQueryBuilder('room')
      .select(['room.id', 'room.name', 'room.cards', 'room.created_at'])
      .addSelect("password is not NULL", "room_hasPassword")
      .orderBy("created_at", "DESC");
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }

  private validateUUID = function (uuid: string): boolean {
    const regexV1 = /^[0-9A-F]{8}-[0-9A-F]{4}-[1][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV2 = /^[0-9A-F]{8}-[0-9A-F]{4}-[2][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV3 = /^[0-9A-F]{8}-[0-9A-F]{4}-[3][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV4 = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
    const regexV5 = /^[0-9A-F]{8}-[0-9A-F]{4}-[5][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

    return regexV1.test(uuid) || regexV2.test(uuid) || regexV3.test(uuid) || regexV4.test(uuid) || regexV5.test(uuid)
  };
}
