import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardActions, CardContent, InputLabel, TextField, Typography } from "@mui/material";

import { roomHasPassword, joinRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, validateUUID } from "../../helpers/helpers";
import { JoinRoomDTO } from "models";

export default function JoinRoomComponent() {
    const navigate = useNavigate();
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
            const room: JoinRoomDTO = {
                id: roomId,
                password: password
            }
            const canJoin: boolean = (await joinRoom(room));

            if (canJoin) {
                navigate(`/room/${roomId}`);
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
        <Box width={{ xs: '100%', s: '100%', md: '50%', l: '33%', xl: '33%' }}
            marginLeft={{ md: '25%', l: '33%', xl: '33%' }}
            marginTop={5} marginBottom={5} >
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                        JOIN ROOM
                    </Typography>
                    <InputLabel id="card-serie-label">Room Id</InputLabel>
                    <TextField
                        fullWidth={true}
                        placeholder="00000000-0000-0000-0000-000000000000"
                        onChange={onRoomIdChange} />
                </CardContent>
                <CardActions>
                    <Button
                        size="small"
                        variant="contained"
                        onClick={onJoinClick}
                        disabled={isUndefinedNullOrEmpty(roomId)} >
                        Join
                    </Button>
                </CardActions>
            </Card>
        </Box>
    );
};