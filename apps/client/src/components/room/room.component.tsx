import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from 'preact-router';
import { getRoom } from '../../services/api.service';
import { validateUUID } from "../../helpers/helpers";
import useLocalStorage from "../../hooks/useLocalStorage ";

type RoomProps = {
  id: string
}

const RoomComponent: FunctionalComponent<RoomProps> = ({ id }) => {
  const [userName] = useLocalStorage('userName', null);
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
    <>
      <div><span onClick={() => route('/') }>Back to home</span>{' '}<span>{userName}</span></div>
      <div>
        <div>Room</div>
        <div>{id}</div>
        <div>{room?.name}</div>
      </div>
    </>
  );
};

export default RoomComponent;
