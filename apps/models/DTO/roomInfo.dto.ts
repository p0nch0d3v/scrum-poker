
export class RoomInfoDTO {
    constructor(id: string, hide: boolean, voting: boolean | null | undefined, admin: string) {
        this.roomId = id;
        this.hide = hide;
        this.voting = voting;
        this.admin = admin;
    }

    roomId: string;
    hide: boolean;
    voting?: boolean | null | undefined;
    admin: string;
};