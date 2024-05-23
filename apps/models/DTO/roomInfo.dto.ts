
export class RoomInfoDTO {
    constructor(id: string, hide: boolean) {
        this.roomId = id;        
        this.hide = hide;
    }

    roomId: string;
    hide: boolean;
};