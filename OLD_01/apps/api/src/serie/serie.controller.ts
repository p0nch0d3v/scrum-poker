import { Controller, Get } from "@nestjs/common";
import { SerieDTO } from "models";
import { SerieService } from "./seire.service";

@Controller('serie')
export class SerieController {
    constructor(private readonly serieService: SerieService) { }

    @Get('all')
    async getAll(): Promise<Array<SerieDTO>> {
      return await this.serieService.getAll();
    }
}