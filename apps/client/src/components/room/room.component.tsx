import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from 'preact-router';
import { getRoom } from '../../services/api.service';
import { validateUUID } from "../../helpers/helpers";

type RoomProps = {
  id: string
}

const RoomComponent: FunctionalComponent<RoomProps> = ({ id }) => {
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    async function useEffectAsync() {
      if (validateUUID(id)) {
        const getRoomResult = await getRoom(id);
        if (!getRoomResult) {
          alert('');
          route(`/`);
        }
        setRoom(getRoomResult);
      }
      else {
        alert('');
        route(`/`);
      }
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
