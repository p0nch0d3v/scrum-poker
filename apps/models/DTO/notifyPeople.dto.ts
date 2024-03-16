import { ParticipantDTO } from "./participant.dto"

export type NotifyPeopleDTO = {
    roomId: string,
    people: Array<ParticipantDTO>
}