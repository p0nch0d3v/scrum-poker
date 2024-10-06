import { Box, Button, Card, CardActions, CardContent, InputLabel, MenuItem, Select, TextField, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';

import { CreateRoomDTO } from 'models';
import { isUndefinedNullOrEmpty, isUndefinedOrNull, sanitizeText } from "../../helpers/helpers";
import useLocalStorage from '../../hooks/useLocalStorage';
import { createRoom, getAllSeries } from '../../services/api.service';
import { SerieDTO } from "models";

export default function CreateRoomComponent() {
    const navigate = useNavigate();
    const [roomName, setRoomName] = useState<string>('');
    const [cardsValues, setCardsValues] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [roomId, setRoomId] = useState<string>('');
    const [admin, setAdmin] = useState<string>('');
    const [userName, setUserName] = useLocalStorage('userName', '');
    const [series, setSeries] = useState<Array<SerieDTO>>([])

    const onRoomNameChange = function (event: any) {
        const inputValue = event.target.value;
        const regex = /[^a-zA-Z0-9]+/gmi;
        const replaceResult = inputValue.replace(regex, '');

        event.target.value = replaceResult;
        setRoomName(replaceResult);
    }

    // TEMPORARY DISABLED
    // const onPasswordChange = function (event: any) {
    //     setPassword(event.target.value);
    // }

    const onCreateClick = async function () {
        const newRoom: CreateRoomDTO = {
            name: roomName,
            admin: admin,
            password: password,
            serie: cardsValues,
            values: series.find((s) => s.serie === cardsValues)?.values
        };
        const createResult = await createRoom(newRoom);

        if (!isUndefinedOrNull(createResult)) {
            if (createResult.success === true) {
                setRoomId(createResult.id || '');
                setPassword('');
                setRoomName('');
                setCardsValues('');
                navigate(`/room/${createResult.id}`);
            }
            else {
                alert(createResult.error);
            }
        }
    }

    const onSeriesChange = function (e: any) {
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

    const getSeries = async () => {
        const allSeries = await getAllSeries();
        setSeries(allSeries);
    };

    useEffect(() => {
        const useEffectAsync = async () => {
            await getSeries();
        };

        useEffectAsync();
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
                        {series.filter((s) => s.isFull === true).map((s) => {
                            return <MenuItem value={s.serie}>{s.name}</MenuItem>;
                        })}
                    </Select>
                    <TextField
                        fullWidth={true}
                        value={cardsValues}
                        disabled={true} />

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