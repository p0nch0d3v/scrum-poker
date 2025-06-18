import { ParticipantDTO } from "./participant.dto"

export type NotifyPeopleDTO = {
    roomId: string,
    hide: boolean,
    voting?: boolean | null | undefined,
    people: Array<ParticipantDTO>
}