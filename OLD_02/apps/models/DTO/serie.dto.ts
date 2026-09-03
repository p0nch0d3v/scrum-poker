
export class SerieDTO {
    constructor(name: string, serie: string, values: string, isFull: boolean, isWildcard: boolean) {
        this.name = name;
        this.serie = serie;
        this.values = values;
        this.isFull = isFull;
        this.isWildcard = isWildcard;
    }

    name: string;
    serie: string
    values: string
    isFull: boolean
    isWildcard: boolean
}