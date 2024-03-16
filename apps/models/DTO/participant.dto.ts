import { CardDTO } from "./card.dto";

export type ParticipantDTO = {
    userName: string,
    socketId: string | undefined,
    vote: CardDTO | undefined,
    hide: boolean
};