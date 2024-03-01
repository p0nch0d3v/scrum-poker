import { useState } from "preact/hooks";
import { route } from 'preact-router';
import { createRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty } from "../../helpers/helpers";

export default function CreateRoomComponent({ userName }: { userName: string }) {
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
        const createResult = await createRoom(roomName, password);

        if (!isUndefinedNullOrEmpty(createResult)) {
            setRoomId(createResult);
            setPassword('');
            setRoomName('');
            route(`/room/${createResult}`);
        }
    }

    const disableCreateRoom = () => {
        return isUndefinedNullOrEmpty(roomName) || isUndefinedNullOrEmpty(userName);
    };

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
                    disabled={disableCreateRoom()}
                    onClick={onCreateClick}
                />
            </div>
            <div>{roomId}</div>
        </div>
    );
}