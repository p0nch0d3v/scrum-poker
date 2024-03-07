
export class RoomDTO {
    constructor(id: string, name: string, cards: string, hasPassword?: boolean) {
        this.id = id;
        this.name = name;
        this.cards = cards;
        this.hasPassword = hasPassword;
    }
    id: string;
    name: string;
    cards: string;
    hasPassword?: boolean;
}
