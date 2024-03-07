import axios from 'axios';

const createRoom = async function (name: string, cards: string, password?: string): Promise<string> {
    return await axios.post('/api/room/create', {
        'name': name,
        'password': password,
        'cards': cards
    }).then((r) => r.data);
};

const roomHasPassword = async function (id: string): Promise<boolean> {
    return await axios.get(`/api/room/hasPassword?id=${id}`)
        .then((r) => r.data);
};

const joinRoom = async function (id: string, password: string) {
    return await axios.post('/api/room/join', {
        'id': id,
        'password': password
    }).then((r) => r.data);
};

const getRoom = async function (id: string) {
    return await axios.get(`/api/room/get?id=${id}`)
        .then((r) => r.data)
        .catch((e) => { console.debug(e); return null; });
};

export {
    createRoom,
    roomHasPassword,
    joinRoom,
    getRoom
}
