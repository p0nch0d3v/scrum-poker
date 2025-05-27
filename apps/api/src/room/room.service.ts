import { Injectable } from '@nestjs/common';
import { validateUUID } from 'common';
import { JoinRoomDTO, RoomDTO, CreateRoomDTO, SetAdminDTO, CreateRoomResultDTO } from 'models';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from './entities/room.entity';
import { Repository, IsNull, Not, SelectQueryBuilder } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RoomService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
  ) { }

  async create(createRoomDto: CreateRoomDTO): Promise<CreateRoomResultDTO> {
    if (createRoomDto.password !== undefined
      && createRoomDto.password !== null
      && createRoomDto.password.trim().length > 0) {
      createRoomDto.password = await this.hashPassword(createRoomDto.password);
    }
    else {
      createRoomDto.password = null;
    }

    const roomExists = await this.exists({ id: createRoomDto.name, password: null });
    if (roomExists === false) {
      const room = await this.roomsRepository.create(createRoomDto);
      await this.roomsRepository.save(room);
      return { success: true, id: room.id, error: null };
    }
    else {
      return { success: false, id: null, error: 'There is already a room with the same name' };;
    }
  }

  async exists(roomDto: JoinRoomDTO): Promise<boolean> {
    const savedRoom = await this.get(roomDto.id);

    if (savedRoom !== undefined && savedRoom !== null) {
      if (savedRoom.password !== undefined && savedRoom.password !== null && roomDto.password !== undefined && roomDto.password !== null) {
        return bcrypt.compare(roomDto.password, savedRoom.password);
      }
      return true;
    }
    return false;
  }

  async hasPassword(id: string): Promise<boolean> {
    if (!validateUUID(id)) {
      return false;
    }

    return (await this.get(id)).hasPassword
  }

  async getByUniqueId(id: string): Promise<RoomDTO> {
    if (!validateUUID(id)) {
      return null;
    }

    const savedRoom = await this.roomsRepository.findOne({
      where: {
        id: id
      }
    });

    return (savedRoom !== undefined && savedRoom !== null) ? new RoomDTO(savedRoom.id,
      savedRoom.name,
      savedRoom.admin,
      savedRoom.serie,
      savedRoom.values,
      savedRoom.created_at,
      savedRoom.password,
      savedRoom.password !== undefined && savedRoom.password !== null && savedRoom.password.length > 0)
      : null;
  }

  async getByName(name: string): Promise<RoomDTO> {
    const queryResult = await (await this.query()).where('LOWER(name) = LOWER(:name)', { name: name }).getRawOne();
    if (queryResult !== undefined && queryResult !== null) {
      return new RoomDTO(queryResult.room_id, queryResult.room_name, queryResult.room_admin, queryResult.room_serie, queryResult.room_values, queryResult.room_created_at, queryResult.room_hasPassword);
    }
    return null;
  }

  async get(id: string): Promise<RoomDTO> {
    let lookupById = false;
    if (validateUUID(id)) {
      lookupById = true;
    }
    let savedRoom = null;
    if (lookupById === true) {
      savedRoom = await this.getByUniqueId(id);
    }
    else {
      savedRoom = await this.getByName(id);
    }
    return savedRoom;
  }

  async getAll(): Promise<Array<RoomDTO>> {
    const rooms = await (await this.query()).getRawMany();
    const allRooms = [];
    rooms.forEach(room => {
      allRooms.push(new RoomDTO(room.room_id, room.room_name, room.room_admin, room.room_serie, room.room_values, room.room_created_at, room.room_password, room.room_hasPassword));
    });

    return allRooms;
  }

  async getCards(id: string): Promise<[string, string]> {
    const savedRoom = await this.getByUniqueId(id);
    if (savedRoom !== undefined && savedRoom !== null) {
      return [savedRoom.serie, savedRoom.values];
    }
    return ['', ''];
  }

  async latest(): Promise<Array<RoomDTO>> {
    const rooms = await (await this.query()).take(10).getRawMany();
    const allRooms = [];
    rooms.forEach(room => {
      allRooms.push(new RoomDTO(room.room_id, room.room_name, room.room_admin, room.room_cards, room.room_created_at, room.room_password, room.room_hasPassword));
    });
    return allRooms;
  }

  async setAdmin(roomInfo: SetAdminDTO): Promise<boolean> {
    const room = await this.getByUniqueId(roomInfo.roomId);
    const updateResult = await this.roomsRepository.update(room.id, { admin: roomInfo.admin });
    return updateResult.affected === 1;
  }

  async getAdmin(id: string): Promise<string | null | undefined> {
    const room = await this.getByUniqueId(id);
    return room?.admin;
  }

  private async query(): Promise<SelectQueryBuilder<Room>> {
    return await this.roomsRepository
      .createQueryBuilder('room')
      .select(['room.id', 'room.name', 'room.admin', 'room.serie', 'room.values', 'room.cards', 'room.created_at', 'room.password'])
      .addSelect("password is not NULL", "room_hasPassword")
      .orderBy("created_at", "DESC");
  }

  private async hashPassword(password: string): Promise<string> {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  }
}
