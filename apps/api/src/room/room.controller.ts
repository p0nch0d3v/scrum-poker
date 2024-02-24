import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO } from './dto/create-room.dto';
import { RoomDTO } from './dto/room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDTO): Promise<string> {
    return await this.roomService.create(createRoomDto);
  }

  @Post('join')
  async join(@Body() roomDto: RoomDTO): Promise<boolean> {
    const exists: boolean =  await this.roomService.exists(roomDto);

    if (!exists) {
      throw new HttpException(`Room [${roomDto.id}] not found`, HttpStatus.NOT_FOUND);
    }
    return exists;
  }
}
