import { Controller, Get } from '@nestjs/common';

@Controller('rooms')
export class RoomsController {

    @Get()
    index(): string {
        return "";
    }
}
