import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { getLatest } from "../../services/api.service";
import { Box, CardContent, List, ListItem, Card, Button, Typography } from "@mui/material";

export default function RoomListComponent() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Array<any>>([]);

    useEffect(() => {
        async function useEffectAsync() {
            const latestRooms = await getLatest();
            setRooms([...latestRooms]);
        }
        useEffectAsync();

    }, []);

    return (
        <Box width={{ xs: '100%', s: '100%', md: '50%', l: '33%', xl: '33%' }}
            marginLeft={{ md: '25%', l: '33%', xl: '33%' }}
            marginTop={5} marginBottom={5}>
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                        OPEN ROOMS
                    </Typography>
                    <List>
                        {rooms.map((room) => (
                            <Box display={'inline-block'} margin={1}>
                                <Button variant="outlined"
                                    href={`/room/${room.id}`}>
                                    {room.name}
                                </Button>
                            </Box>
                        ))}
                    </List>
                </CardContent>
            </Card>

        </Box>
    )
}
