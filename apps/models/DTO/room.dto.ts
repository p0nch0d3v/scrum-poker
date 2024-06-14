
export class RoomDTO {
    constructor(id: string, name: string, admin: string, cards: string, created_at: Date, hasPassword?: boolean) {
        this.id = id;
        this.name = name;
        this.admin = admin;
        this.cards = cards;
        this.created_at = created_at;
        this.hasPassword = hasPassword;
    }
    id: string;
    name: string;
    admin: string;
    cards: string;
    hasPassword?: boolean;
    created_at: Date
}
