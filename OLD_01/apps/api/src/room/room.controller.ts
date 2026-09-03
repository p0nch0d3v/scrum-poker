import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus, Query, Put, NotFoundException } from '@nestjs/common';
import { RoomService } from './room.service';
import { CreateRoomDTO, CreateRoomResultDTO, JoinRoomDTO, RoomDTO, SetAdminDTO } from 'models';

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) { }

  @Post('create')
  async create(@Body() createRoomDto: CreateRoomDTO): Promise<CreateRoomResultDTO> {
    return await this.roomService.create(createRoomDto);
  }

  @Get('hasPassword')
  async hasPassword(@Query('id') id: string): Promise<boolean> {
    return await this.roomService.hasPassword(id);
  }

  @Post('join')
  async join(@Body() roomDto: JoinRoomDTO): Promise<boolean> {
    const exists: boolean = await this.roomService.exists(roomDto);

    if (!exists) {
      throw new HttpException(`Room [${roomDto.id}] not found`, HttpStatus.NOT_FOUND);
    }
    return exists;
  }

  @Get('get')
  async get(@Query('id') id: string): Promise<RoomDTO | HttpException> {
    const result = await this.roomService.get(id);
    if (result === null) {
      throw new HttpException('Not Found', HttpStatus.NOT_FOUND)
    }
    return result;
  }

  @Get('all')
  async getAll(): Promise<Array<RoomDTO>> {
    return await this.roomService.getAll();
  }

  @Get('latest')
  async latest(): Promise<Array<RoomDTO>> {
    return await this.roomService.latest();
  }

  @Put('setAdmin')
  async setAdmin(@Body() roomInfo: SetAdminDTO): Promise<boolean> {
    return await this.roomService.setAdmin(roomInfo)
  }
}
