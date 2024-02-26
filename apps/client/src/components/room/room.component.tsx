import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { getRoom } from '../../services/api.service';

type RoomProps = {
  id: string
}

const RoomComponent: FunctionalComponent<RoomProps> = ({ id }) => {
  const [room, setRoom] = useState<any>(null);
  
  useEffect(() => {
    async function useEffectAsync() {
      const getRoomResult = await getRoom(id);
      console.debug(getRoomResult);
      setRoom(getRoomResult);
      //setRoom(await getRoom(id));
    }
    useEffectAsync();
  }, []);

  return (
    <div>
      <div>Room</div>
      <div>{id}</div>
      <div>{room?.name}</div>
    </div>
  );
};

export default RoomComponent;
