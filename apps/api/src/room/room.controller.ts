import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDto): Promise<string> {
    return await this.roomService.create(createRoomDto);
  }
}
