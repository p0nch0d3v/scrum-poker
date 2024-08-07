
export class RoomInfoDTO {
    constructor(id: string, hide: boolean, admin: string) {
        this.roomId = id;
        this.hide = hide;
        this.admin = admin;
    }

    roomId: string;
    hide: boolean;
    admin: string;
};