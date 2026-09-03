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
        const series = await (await this.query(true, true)).getRawMany();
        const allSeries = [];
        series.forEach(serie => {
            allSeries.push(new SerieDTO(serie.serie_name, serie.serie_serie, serie.serie_values, serie.serie_isFull, serie.serie_isWildcard));
        });

        return allSeries;
    }

    async getFull(): Promise<Array<SerieDTO>> {
        const series = await (await this.query(true, false)).getRawMany();
        const allSeries = [];
        series.forEach(serie => {
            allSeries.push(new SerieDTO(serie.serie_name, serie.serie_serie, serie.serie_values, serie.serie_isFull, serie.serie_isWildcard));
        });

        return allSeries;
    }

    async getWildcard(): Promise<Array<SerieDTO>> {
        const series = await (await this.query(false, true)).getRawMany();
        const allSeries = [];
        series.forEach(serie => {
            allSeries.push(new SerieDTO(serie.serie_name, serie.serie_serie, serie.serie_values, serie.serie_isFull, serie.serie_isWildcard));
        });

        return allSeries;
    }

    private async query(full: boolean = false, wildcard: boolean = false): Promise<SelectQueryBuilder<Serie>> {
        const tmpQuery = this.serieRepository
        .createQueryBuilder('serie')
        .select(['serie.name', 'serie.serie', 'serie.values', 'serie.isFull', 'serie.isWildcard'])
        .orderBy("id", "ASC");

        if (full === true) {
            tmpQuery.where('serie.isFull = :full', {full: full});
        }
        else if (wildcard === true) {
            tmpQuery.where('serie.isWildcard = :wildcard', {wildcard: wildcard});
        }

        return await tmpQuery;
    }
}