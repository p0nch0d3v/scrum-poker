
export class RoomDTO {
    constructor(id: string, name: string, hasPassword?: boolean) {
        this.id = id;
        this.name = name;
        this.hasPassword = hasPassword;
    }
    id: string;
    name: string;
    hasPassword?: boolean;
}
