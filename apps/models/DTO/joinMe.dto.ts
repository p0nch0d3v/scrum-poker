import { UserDTO } from "./user/user.dto"

export type JoinMeDTO = {
    roomId: string,
    user: UserDTO
}