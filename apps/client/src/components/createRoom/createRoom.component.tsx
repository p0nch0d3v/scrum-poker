import { useState } from "preact/hooks";
import { route } from 'preact-router';
import { createRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty } from "../../helpers/helpers";

export default function CreateRoomComponent() {
    const [roomName, setRoomName] = useState<string>('');
    const [cardsValues, setCardsValues] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');

    const fibonacciSerie = "1,2,3,5,8,13,21";
    const tShirtSerie = "XS,S,M,L,XL";

    const onRoomNameChange = function (event: any) {
        setRoomName(event.target.value)
    }

    // TEMPORARY DISABLED
    // const onPasswordChange = function (event: any) {
    //     setPassword(event.target.value);
    // }

    const onCreateClick = async function () {
        const createResult = await createRoom(roomName, cardsValues, password);

        if (!isUndefinedNullOrEmpty(createResult)) {
            setRoomId(createResult);
            setPassword('');
            setRoomName('');
            setCardsValues('');
            route(`/room/${createResult}`);
        }
    }

    const onSeriesChange = function (e: any) {
        console.log(e?.target?.value);
        setCardsValues(e?.target?.value);
    };

    const onCardsValuesChange = function (e: any) {
        const newValue = e?.target?.value;
        setCardsValues(newValue);
    }

    const disableCreateRoom = () => {
        return isUndefinedNullOrEmpty(roomName) || isUndefinedNullOrEmpty(cardsValues);
    };

    return (
        <div style={{ border: '1px solid white', margin: 10 }}>
            <div>Create Room</div>
            <div>Name:</div>
            <div>
                <input value={roomName} type="text" onChange={onRoomNameChange} />
            </div>
            {/* TEMPORARY DISABLED */}
            {/* <div>Password</div>
            <div>
                <input value={password} type="password" onChange={onPasswordChange} />
            </div> */}
            <div>
                <select value={cardsValues} onChange={onSeriesChange}>
                    <option value={''} selected={true}>NONE</option>
                    <option value={fibonacciSerie}>Fibonacci</option>
                    <option value={tShirtSerie}>T-Shirt</option>
                </select>
            </div>
            <div>
                <input value={cardsValues} type="text" onChange={onCardsValuesChange} />
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