import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Serie } from "./entities/serie.entity";
import { SerieDTO } from "models";
import { Repository, SelectQueryBuilder } from "typeorm";

@Injectable()
export class SerieService {
    constructor(
        @InjectRepository(Serie)
        private serieRepository: Repository<Serie>,
    ) { }

    async getAll(): Promise<Array<SerieDTO>> {
        const series = await (await this.query()).getRawMany();
        const allSeries = [];
        series.forEach(serie => {
            allSeries.push(new SerieDTO(serie.serie_name, serie.serie_serie, serie.serie_values, serie.serie_isFull, serie.serie_isWildcard));
        });

        return allSeries;
    }

    private async query(): Promise<SelectQueryBuilder<Serie>> {
        return await this.serieRepository
            .createQueryBuilder('serie')
            .select(['serie.name', 'serie.serie', 'serie.values', 'serie.isFull', 'serie.isWildcard'])
            .orderBy("id", "ASC");
    }
}