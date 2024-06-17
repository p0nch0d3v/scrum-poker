
export class RoomDTO {
    constructor(id: string | undefined, name: string | undefined, admin: string | undefined, cards: string | undefined, created_at: Date | undefined, hasPassword?: boolean | undefined) {
        this.id = id;
        this.name = name;
        this.admin = admin;
        this.cards = cards;
        this.created_at = created_at;
        this.hasPassword = hasPassword;
    }
    id: string | undefined;
    name: string| undefined;
    admin: string| undefined;
    hide?: boolean| undefined;
    cards: string| undefined;
    hasPassword?: boolean| undefined;
    created_at: Date| undefined
}
