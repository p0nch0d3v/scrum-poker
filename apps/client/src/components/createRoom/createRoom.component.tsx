import { useState } from "preact/hooks";
import { createRoom } from '../../services/api.service';

export default function CreateRoomComponent() {
    const [roomName, setRoomName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    const onRoomNameChange = function (event: any) {
        setRoomName(event.target.value)
    }

    const onPasswordChange = function (event: any) {
        setPassword(event.target.value);
    }

    const onCreateClick = async function () {
        const result = await createRoom(roomName, password);
        setRoomId(result);
        setPassword('');
        setRoomName('');
    }

    return (
        <div style={{border: '1px solid cyan', margin: 10}}>
            <div>Create Room</div>
            <div>Name:</div>
            <div>
                <input value={roomName} type="text" onChange={onRoomNameChange} />
            </div>
            <div>Password</div>
            <div>
                <input value={password} type="password" onChange={onPasswordChange} />
            </div>
            <div>
                <input type="button"
                    value="Create"
                    disabled={roomName === undefined || roomName === null || roomName.trim().length == 0}
                    onClick={onCreateClick}
                />
            </div>
            <div>{roomId}</div>
        </div>
    );
}