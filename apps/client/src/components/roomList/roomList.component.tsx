import { useEffect, useState } from "preact/hooks"
import { getLatest } from "../../services/api.service";

export default function RoomListComponent() {
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
                    <a target={'self'} href={`/room/${room.id}`}>
                        <span>{room.name}</span>
                    </a>
                </div>
            ))}
        </div>
    )
}