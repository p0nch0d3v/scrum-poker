import { ParticipantDTO } from "./participant.dto"

export type NotifyPeopleDTO = {
    roomId: string,
    hide: boolean,
    people: Array<ParticipantDTO>
}