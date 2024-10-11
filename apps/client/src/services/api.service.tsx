import axios from 'axios';
import { CreateRoomDTO, JoinRoomDTO, RoomDTO, SetAdminDTO, ServerConfigDTO, SerieDTO, CreateRoomResultDTO, UserDTO } from 'models';

const createRoom = async function (newRoom: CreateRoomDTO): Promise<CreateRoomResultDTO> {
    return await axios.post('/api/room/create', newRoom).then((r) => r.data);
};

const roomHasPassword = async function (id: string): Promise<boolean> {
    return await axios.get(`/api/room/hasPassword?id=${id}`)
        .then((r) => r.data);
};

const joinRoom = async function (room: JoinRoomDTO) {
    return await axios.post('/api/room/join', room).then((r) => r.data);
};

const getRoom = async function (id: string | undefined): Promise<RoomDTO> {
    return await axios.get(`/api/room/get?id=${id}`)
        .then((r) => r.data)
        .catch((e) => { console.debug(e); return null; });
};

const getLatest = async function (): Promise<Array<RoomDTO>> {
    return await axios.get('/api/room/latest')
        .then((r) => r.data);
}

const setRoomAdmin = async function (roomInfo: SetAdminDTO): Promise<boolean> {
    return await axios.put('/api/room/setAdmin', roomInfo).then((r) => r.data);
}

const getServerConfig = async function(): Promise<ServerConfigDTO> {
    return await axios.get('/api/config/all').then((r) => r.data);
}

const getAllSeries = async function(): Promise<Array<SerieDTO>> {
    return await axios.get('/api/serie/all').then((r) => r.data);
}

const loginUser = async function(token: string): Promise<UserDTO> {
    return await axios.post("/api/auth/login", { token: token }).then((r) => r.data);
}

export {
    createRoom,
    roomHasPassword,
    joinRoom,
    getRoom,
    getLatest,
    setRoomAdmin,
    getServerConfig,
    getAllSeries,
    loginUser
}
