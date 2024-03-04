import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";
import { route } from 'preact-router';
import { getRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, validateUUID } from "../../helpers/helpers";
import useLocalStorage from "../../hooks/useLocalStorage ";
import { io, Socket } from 'socket.io-client';

type RoomProps = {
  id: string
}

const RoomComponent: FunctionalComponent<RoomProps> = ({ id }) => {
  const [userName] = useLocalStorage('userName', null);
  const [room, setRoom] = useState<any>(null);
  const [users, setUsers] = useState<Array<any>>([]);
  const [connected, setConnected] = useState<boolean | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [wsServer, setWsServer] = useState(io('develop.local:3000', { autoConnect: false, reconnection: true }))

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

      setConnected(wsServer.connected);
      setConnectionId(wsServer.id)

      if (!connected) {
        const _interval_id = setInterval(conntectWS, 1000);
        setIntervalId(_interval_id);
      }
      setWsServer(setWsEvents(wsServer));
    }
    useEffectAsync();

    return () => {
      if (wsServer.connected || !wsServer.disconnected) {
        wsServer.off('joined', onJoinedHandler);
        wsServer.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    if (wsServer.connected === true || !isUndefinedNullOrEmpty(connectionId)) {
      clearInterval(intervalId);
    };
  }, [connected, connectionId])

  const onJoinedHandler = function (data: any) {
    console.log('joined', data);
    if (data.roomId === id) {
      let serverUsers = Array<any>();
      data.people.forEach(function (user: any) {
        serverUsers.push({ userName: user.userName, socketId: user.socketId });
      });
      setUsers(serverUsers);
    }
  }

  const setWsEvents = function (socket: Socket): Socket {
    socket.off('connect').on('connect', function () {
      console.log('connect');
      socket.emit('join_me', { roomId: id, userName: userName });
      let usersTmp = Array<any>();
      usersTmp.push({ socketId: connectionId, userName: userName });
      setUsers(usersTmp);
    });

    socket.on('joined', onJoinedHandler);

    return socket;
  }

  const conntectWS = function () {
    console.log('conntectWS');

    setWsServer(wsServer.connect());
    setConnected(wsServer.connected);
    setConnectionId(wsServer.id);

    console.log(wsServer);
  };

  return (
    <>
      <div><span onClick={() => route('/')}>Back to home</span>{' '}<span>{userName}</span></div>
      <div>
        <div>Room</div>
        <div>{id}</div>
        <div>{room?.name}</div>
      </div>

      <div>
        {connected ? "true" : "false"}
      </div>
      <div>
        {connectionId}
      </div>
      <div>
        {wsServer && wsServer.connected &&
          <button onClick={async () => wsServer.emit('ping')}>ping</button>}
      </div>
      <div>
        {users.map((user) => (
          <>
            <div>
              <span>{user.userName}</span>
              {' '}
              <span>{user.socketId}</span>
              {' '}
              <span>{user.socketId === connectionId ? '*': ''}</span>
            </div>
            </>
        ))}
      </div>
    </>
  );
};

export default RoomComponent;
