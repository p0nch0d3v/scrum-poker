import { CardDTO } from "./card.dto";
import { UserDTO } from "./user/user.dto";

export type ParticipantDTO = {
    user: UserDTO,
    socketId: string | undefined,
    vote: CardDTO | undefined,
    hide: boolean,
    isAdmin: boolean
};