import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io, Socket } from 'socket.io-client';
import { Box, Button, CircularProgress, Typography } from "@mui/material";

import { getRoom } from '../../services/api.service';
import { isUndefinedNullOrEmpty, shuffleArray, validateUUID } from "../../helpers/helpers";
import useLocalStorage from "../../hooks/useLocalStorage ";
import Config from "../../config/config";
import CardComponent from "../card/card.component";
import ParticipantComponent from "../participant/participant.component";
import UserNameModalComponent from "../userNameModal/userNameModal.component";
import { CardDTO, NofityCardsDTO, NotifyPeopleDTO } from 'models'
import { ErrorDTO } from "models/DTO/error.dto";
import { ParticipantDTO } from "models/DTO/participant.dto";
import ErrorModalComponent from "../invalidRoomModal/errorModal.component";
import { ErrorSharp } from "@mui/icons-material";

const Messages = {
  FROM_SERVER: {
    people: 'people',
    connect: 'connect',
    cards: 'cards',
    error: 'error'
  },
  TO_SERVER: {
    disconnect: 'disconnect',
    join_me: 'join_me',
    vote: 'vote',
    clear_votes: 'clear_votes',
    hide_unHide: 'hide_unHide'
  }
}

const RoomComponent = function () {
  let { id } = useParams();
  id = (id === undefined || id === null) ? '' : id;

  const [userName] = useLocalStorage('userName', null);
  const [validRoom, setValidRoom] = useState<boolean>()
  const [validUserName, setValidUserName] = useState<boolean>()
  const [room, setRoom] = useState<any>(null);
  const [users, setUsers] = useState<Array<ParticipantDTO>>([]);
  const [cards, setCards] = useState<Array<CardDTO>>([]);
  const [connected, setConnected] = useState<boolean | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>('');
  const [error, setError] = useState<ErrorDTO>({});
  const [intervalId, setIntervalId] = useState<any>();
  const [wsServer, setWsServer] = useState(io(Config.SOCKET_SERVER, { autoConnect: false, reconnection: true }));
  const navigate = useNavigate();

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
        wsServer.off(Messages.FROM_SERVER.error, onErrorHandler);
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

  useEffect(() => {
    if (error?.message && (error.roomId !== id || (connectionId && error.socketId !== connectionId))) {
      setError({})
    }
  }, [error, connectionId])

  /* ---------- */

  const onConnectHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.connect}]`, data);
    wsServer.emit(Messages.TO_SERVER.join_me, { roomId: id, userName: userName });
    // let usersTmp = Array<ParticipantDTO>();
    // usersTmp.push({ socketId: connectionId, userName: userName, vote: undefined, hide: users[0].hide });
    // setUsers(usersTmp);
  };

  const onPeopleHandler = function (data: NotifyPeopleDTO) {
    console.log(`[${Messages.FROM_SERVER.people}]`, data);
    if (data.roomId === id) {
      setRoom({ ...room, hide: data.hide })
      if (data.hide === false) {
        var sortedArray: ParticipantDTO[] = data.people.sort((n1, n2) => {
          return (isNaN(Number(n2.vote?.value)) ? -1 : Number(n2.vote?.value))
            - (isNaN(Number(n1.vote?.value)) ? -1 : Number(n1.vote?.value))
        });
        data.people = sortedArray;
      }
      setUsers(data.people);
    }
  };

  const onCardsHandler = function (data: NofityCardsDTO) {
    console.log(`[${Messages.FROM_SERVER.cards}]`, data);
    if (data.roomId === id) {
      setCards(shuffleArray(data.cards));
    }
  }

  const onErrorHandler = function (data: ErrorDTO) {
    setError(data);
  }

  const onVoteClick = function (value: CardDTO) {
    console.log(`[${Messages.TO_SERVER.vote}]`, value);
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
    socket.on(Messages.FROM_SERVER.error, onErrorHandler);
    return socket;
  }

  const conntectWS = function () {
    setWsServer(wsServer.connect());
    setConnected(wsServer.connected);
    setConnectionId(wsServer.id);
  };

  const backToHome = () => {
    setTimeout(() => {
      navigate('/', { replace: true });
      window.location.reload();
    }, 1);
  };

  const participantListWrapperStyle = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    marginTop: '1rem'
  }

  return (

    <Box width={'100vw'} height={'100vh'} sx={{ paddingLeft: 4, paddingRight: 4 }}>
      {validRoom === false && <ErrorModalComponent
        open={validRoom === false}
        onClose={backToHome}
        message="Invalid room Id" />}

      {validRoom === true && (isUndefinedNullOrEmpty(userName) || validUserName === false)
        && <UserNameModalComponent open={!userName} onClose={backToHome} />}

      {error !== null && !isUndefinedNullOrEmpty(error.message)
        && <ErrorModalComponent open={!isUndefinedNullOrEmpty(error.message)}
          onClose={backToHome}
          message={error?.message} />}

      {validRoom === true && !isUndefinedNullOrEmpty(userName) && !error.message &&
        <>
          <Typography sx={{ fontSize: '1em', textAlign: 'center', marginTop: '1em' }}
            color="text.secondary"
            gutterBottom>
            ROOM: {room?.name}
          </Typography>

          {(!connected || isUndefinedNullOrEmpty(connectionId)) &&
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50%" }}>
              <CircularProgress size={100} />
            </Box>}

          {connected && !isUndefinedNullOrEmpty(connectionId) &&
            <Box display={'flex'} flexDirection={'column'}>
              <Box style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {cards.map((card) =>
                  <CardComponent card={card} disabled={room?.hide === false}
                    onClick={() => { onVoteClick(card); }} />
                )}
              </Box>

              <Box width={{ xs: '100%', s: '100%', md: '50%', l: '50%', xl: '50%' }}
                marginTop={2}
                display={'flex'}
                justifyContent={'space-between'}
                alignSelf={'center'}>
                <Button variant="contained" 
                  onClick={onClearAllClick}>Clear All</Button>
                <Button variant="contained"
                  onClick={OnHideUnHideClick}>{room?.hide ? 'Unhide' : 'Hide'}</Button>
              </Box>

              <Box
                sx={participantListWrapperStyle}
                width={{ xs: '100%', s: '100%', md: '75%', l: '75%', xl: '75%' }}>
                {[...new Set(users)].map((user) =>
                  <ParticipantComponent participant={user} current={user.socketId === connectionId ? true : false} />
                )}
              </Box>
            </Box>
          }
        </>
      }
    </Box>
  );
};

export default RoomComponent;
