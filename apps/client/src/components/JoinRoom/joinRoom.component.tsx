import { useState } from "preact/hooks";
import { route } from 'preact-router';
import { roomHasPassword, joinRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, validateUUID } from "../../helpers/helpers";

export default function JoinRoomComponent() {
    const [roomId, setRoomId] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomNeedsPassword, setRoomNeedsPassword] = useState<boolean>(false);

    const onRoomIdChange = async function (event: any) {
        const value = event?.target?.value;

        if (!isUndefinedNullOrEmpty(value) && validateUUID(value)) {
            setRoomId(value);
            const hasPassword: boolean = await roomHasPassword(value);
            setRoomNeedsPassword(hasPassword);
        }
        else {
            setRoomId('');
            setRoomNeedsPassword(false);
        }
    };

    const onPasswordChange = async function (event: any) {
        const value = event?.target?.value;
        setPassword(value);
    }

    const onJoinClick = async function () {
        if (!isUndefinedNullOrEmpty(roomId)) {
            const canJoin: boolean = (await joinRoom(roomId, password));

            if (canJoin) {
                route(`/room/${roomId}`);
            }
        }
    };

    // TEMPORARY DISABLED
    // const disableJoinButton = function (): boolean {
    //     const noUserName = isUndefinedNullOrEmpty(userName);
    //     const noRomm = isUndefinedNullOrEmpty(roomId);
    //     const noPass = isUndefinedNullOrEmpty(password);

    //     return noUserName || noRomm || (roomNeedsPassword && noPass);
    // }

    return (
        <div style={{ border: '1px solid white', margin: 10 }}>
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
            <input type="button" value="Join" onClick={onJoinClick} disabled={isUndefinedNullOrEmpty(roomId)} />
        </div>
    );
};