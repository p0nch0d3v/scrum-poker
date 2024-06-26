import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";

import { createRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, sanitizeText } from "../../helpers/helpers";
import useLocalStorage from '../../hooks/useLocalStorage ';
import { CreateRoomDTO } from 'models';

export default function CreateRoomComponent() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [cardsValues, setCardsValues] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [admin, setAdmin] = useState<string>('');
    const [userName, setUserName] = useLocalStorage('userName', '');

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
        const newRoom: CreateRoomDTO = {
            name: roomName, admin: admin, password: password, cards: cardsValues
        };
        const createResult = await createRoom(newRoom);

        if (!isUndefinedNullOrEmpty(createResult)) {
            setRoomId(createResult);
            setPassword('');
            setRoomName('');
            setCardsValues('');
            navigate(`/room/${createResult}`);
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

    const onAdminNameChange = function (e: any) {
        const newValue = e?.target?.value;
        setAdmin(newValue);
    }

    const disableCreateRoom = () => {
        return isUndefinedNullOrEmpty(roomName) || isUndefinedNullOrEmpty(cardsValues);
    };

    useEffect(() => {
        setUserName(sanitizeText(userName));
    }, [])

    useEffect(() => {
        setAdmin(userName);
    }, [userName])

    return (
        <Box width={{ xs: '100%', s: '100%', md: '50%', l: '33%', xl: '33%' }}
            marginLeft={{ md: '25%', l: '33%', xl: '33%' }}
            marginTop={5} marginBottom={5}>
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                        CREATE ROOM
                    </Typography>

                    <InputLabel id="room-name-label">Room Name</InputLabel>
                    <TextField
                        fullWidth={true}
                        placeholder="Room Name"
                        style={{ marginBottom: "1em" }}
                        onChange={onRoomNameChange} />

                    <InputLabel id="card-serie-label">Card Serie</InputLabel>
                    <Select
                        fullWidth={true}
                        labelId="card-serie-label"
                        onChange={onSeriesChange}>
                        <MenuItem value={''} selected={true}>NONE</MenuItem >
                        <MenuItem value={fibonacciSerie}>Fibonacci</MenuItem>
                        <MenuItem value={tShirtSerie}>T-Shirt</MenuItem>
                    </Select>
                    <TextField
                        fullWidth={true}
                        value={cardsValues}
                        onChange={onCardsValuesChange} />

                    <InputLabel id="card-admin-label">Admin</InputLabel>
                    <TextField
                        fullWidth={true}
                        placeholder="Room Admin"
                        style={{ marginBottom: "1em" }}
                        disabled
                        value={userName}
                        onChange={onAdminNameChange} />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={onCreateClick}
                        disabled={disableCreateRoom()} >
                        Create
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
}