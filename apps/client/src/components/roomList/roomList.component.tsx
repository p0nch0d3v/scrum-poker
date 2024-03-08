import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";

import { getLatest } from "../../services/api.service";

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
        <div style={{ border: '1px solid white', margin: 10, padding: 10 }}>
            {rooms.map((room) => (
                <div>
                    <span onClick={() => navigate(`/room/${room.id}`)}>
                        <span>{room.name}</span>
                    </span>
                </div>
            ))}
        </div>
    )
}