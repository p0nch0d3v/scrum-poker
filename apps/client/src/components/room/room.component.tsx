import { FunctionalComponent } from "preact";
import { useEffect, useState } from "preact/hooks";

import { getRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, validateUUID } from "../../helpers/helpers";
import useLocalStorage from "../../hooks/useLocalStorage ";
import { io, Socket } from 'socket.io-client';
import Config from "../../config/config";
import HeaderComponent from "../header/header.component";

const Messages = {
  FROM_SERVER: {
    people: 'people',
    connect: 'connect',
    cards: 'cards'
  },
  TO_SERVER: {
    disconnect: 'disconnect',
    join_me: 'join_me',
    vote: 'vote',
    clear_votes: 'clear_votes',
    hide_unHide: 'hide_unHide'
  }
}

type RoomProps = {
  id: string
}

const RoomComponent: FunctionalComponent<RoomProps> = ({ id }) => {
  const [userName] = useLocalStorage('userName', null);
  const [validRoom, setValidRoom] = useState<boolean>()
  const [room, setRoom] = useState<any>(null);
  const [users, setUsers] = useState<Array<any>>([]);
  const [cards, setCards] = useState<Array<any>>([]);
  const [connected, setConnected] = useState<boolean | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>('');
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [wsServer, setWsServer] = useState(io(Config.SOCKET_SERVER, { autoConnect: false, reconnection: true }))

  useEffect(() => {
    async function useEffectAsync() {
      let isValidRoom = false;
      if (validateUUID(id)) {
        const getRoomResult = await getRoom(id);
        isValidRoom = getRoomResult !== undefined && getRoomResult !== null;
        setValidRoom(isValidRoom);
        setRoom(getRoomResult);
      }
      else {
        setValidRoom(false);
      }

      if (isValidRoom && !isUndefinedNullOrEmpty(userName)) {
        setConnected(wsServer.connected);
        setConnectionId(wsServer.id)

        if (!connected) {
          const _interval_id = setInterval(conntectWS, 500);
          setIntervalId(_interval_id);
        }
        setWsServer(setWsEvents(wsServer));
      }
    }
    useEffectAsync();

    return () => {
      if (wsServer.connected || !wsServer.disconnected) {
        wsServer.off(Messages.FROM_SERVER.connect, onConnectHandler);
        wsServer.off(Messages.FROM_SERVER.people, onPeopleHandler);
        wsServer.off(Messages.FROM_SERVER.cards, onCardsHandler);
        wsServer.disconnect();
      }
      if (intervalId) {
        clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, []);

  useEffect(() => {
    if (wsServer.connected === true || !isUndefinedNullOrEmpty(connectionId)) {
      clearInterval(intervalId);
    };
  }, [connected, connectionId])

  /* ---------- */

  const onConnectHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.connect}]`, data);
    wsServer.emit('join_me', { roomId: id, userName: userName });
    let usersTmp = Array<any>();
    usersTmp.push({ socketId: connectionId, userName: userName });
    setUsers(usersTmp);
  };

  const onPeopleHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.people}]`, data);
    if (data.roomId === id) {
      setUsers(data.people);
    }
  };

  const onCardsHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.people}]`, data);

    if (data.roomId === id) {
      setCards(data.cards);
    }
  }

  const onVoteClick = function (value: any) {
    wsServer.emit(Messages.TO_SERVER.vote, { roomId: id, userId: connectionId, vote: value });
  };

  const onClearAllClick = function () {
    wsServer.emit(Messages.TO_SERVER.clear_votes, { roomId: id });
  }

  const OnHideUnHideClick = function () {
    wsServer.emit(Messages.TO_SERVER.hide_unHide, { roomId: id });
  }

  /* ---------- */

  const setWsEvents = function (socket: Socket): Socket {
    socket.on(Messages.FROM_SERVER.connect, onConnectHandler);
    socket.on(Messages.FROM_SERVER.people, onPeopleHandler);
    socket.on(Messages.FROM_SERVER.cards, onCardsHandler);
    return socket;
  }

  const conntectWS = function () {
    setWsServer(wsServer.connect());
    setConnected(wsServer.connected);
    setConnectionId(wsServer.id);
  };

  return (
    <>
      <HeaderComponent />
      {!userName && <div>Invalid username</div>}
      {!validRoom && <div>Invalid room</div>}
      {validRoom && userName &&
        <>

          <div>
            <div>Room</div>
            <div>room id: {id}</div>
            <div>room name: {room?.name}</div>
          </div>

          <div>
            intervalId: {intervalId}
          </div>

          <div>
            connected: {connected ? "true" : "false"}
          </div>
          <div>
            connectionId: {connectionId}
          </div>
          <hr />
          <div>
            <div>CARDS</div>
            {cards.map((card) => (
              <div>
                <span>{card.text}</span>
                <button onClick={() => { onVoteClick(card); }} value={card.value}>{card.text}</button>
              </div>
            ))}
          </div>
          <hr />
          <div>
            <button onClick={onClearAllClick} >Clear All</button>
            <button onClick={OnHideUnHideClick} >Hide / Unhide</button>
          </div>
          <hr />
          <div>
            {users.map((user) => (
              <div>
                <span>{user.userName}</span>
                {' '}
                <span>{user.socketId}</span>
                {' '}
                <span>{user.socketId === connectionId ? '*' : ''}</span>
                {' '}
                <span>{user.hide ? '?' : user.vote ? JSON.stringify(user.vote) : ''}</span>
              </div>
            ))}
          </div>
        </>}
    </>
  );
};

export default RoomComponent;
