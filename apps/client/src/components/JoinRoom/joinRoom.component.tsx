import { useState } from "preact/hooks";
import { route } from 'preact-router';
import { roomHasPassword, joinRoom } from '../../services/api.service';

export default function JoinRoomComponent() {
    const [roomId, setRoomId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomNeedsPassword, setRoomNeedsPassword] = useState<boolean>(false);

    const onRoomIdChange = async function (event: any) {
        const value = event?.target?.value;

        if (value !== undefined && value !== null && value?.trim().length > 0) {
            setRoomId(value);
            setRoomNeedsPassword(await roomHasPassword(value));
        }
        else {
            setRoomId('');
            setRoomNeedsPassword(false);
        }
    };

    const onPasswordChange = async function (event: any) {
        const value = event?.target?.value;
        if (value !== undefined && value !== null && value?.trim().length > 0) {
            setPassword(value);
        }
    }

    const onJoinClick = async function () {
        const canJoin = await joinRoom(roomId, password);
        console.debug('canJoin =', canJoin);
        if (canJoin) {
            route(`/room/${roomId}`);
        }
    };

    return (
        <div style={{border: '1px solid orange', margin: 10}}>
            <div>Join Room</div>
            <div>
                <div>Room:</div>
                <div>
                    <input value={roomId} type="text" onChange={onRoomIdChange} />
                </div>
            </div>
            {roomNeedsPassword && (<div>
                <div>Password:</div>
                <div>
                    <input value={password} type="password" onChange={onPasswordChange} />
                </div>
            </div>)}
            <input type="button" value="Join" onClick={onJoinClick} />
        </div>
    );
};