import axios from 'axios';

const createRoom = async function (name?: string, password?: string): Promise<string> {
    return await axios.post('/api/room/create', {
        'name': name,
        'password': password
    }).then((r) => r.data);
}

export { createRoom }