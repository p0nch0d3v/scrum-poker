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
        <Box width={{ xs: '100%', s: '100%', md: '50%', l: '33%', xl: '33%' }} margin={1}>
            <Card>
                <CardContent>
                    <Typography sx={{ fontSize: 14, textAlign: 'center' }} color="text.secondary" gutterBottom>
                        OPEN ROOMS
                    </Typography>
                    <List>
                        {rooms.map((room) => (
                            <ListItem>
                                <Button variant="outlined"
                                    href={`/room/${room.id}`}
                                    target={'blank'}>
                                    {room.name}
                                </Button>
                            </ListItem>
                        ))}
                    </List>
                </CardContent>
            </Card>

        </Box>
    )
}
