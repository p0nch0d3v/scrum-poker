
export class RoomDTO {
    constructor(id: string | undefined, name: string | undefined, admin: string | undefined, serie: string | undefined, values: string | undefined, created_at: Date | undefined, hasPassword?: boolean | undefined) {
        this.id = id;
        this.name = name;
        this.admin = admin;
        this.serie = serie;
        this.values = values;
        this.created_at = created_at;
        this.hasPassword = hasPassword;
    }
    id: string | undefined;
    name: string| undefined;
    admin: string| undefined;
    hide?: boolean| undefined;
    serie: string | null | undefined;
    values: string | null | undefined;
    hasPassword?: boolean| undefined;
    created_at: Date| undefined
}
