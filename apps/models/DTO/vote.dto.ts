import { CardDTO } from "./card.dto"

export type VoteDTO = {
    roomId: string,
    userId: string,
    vote: CardDTO
}