import { Box, Button, CircularProgress, LinearProgress, Paper, Table, TableContainer, TableHead, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from 'socket.io-client';

import { CardDTO, ErrorDTO, NofityCardsDTO, NotifyPeopleDTO, ParticipantDTO, RoomDTO } from "models";
import Config from "../../config/config";
import { isUndefinedNullOrEmpty, isUndefinedOrNull, sanitizeText, shuffleArray, validateUUID } from "../../helpers/helpers";
import useLocalStorage from "../../hooks/useLocalStorage";
import { getRoom, setRoomAdmin } from '../../services/api.service';
import CardComponent from "../card/card.component";
import ErrorModalComponent from "../invalidRoomModal/errorModal.component";
import ParticipantComponent from "../participant/participant.component";
import UserNameModalComponent from "../userNameModal/userNameModal.component";
import ResultsComponent from "../results/results.component";

type VoteSummary = {
  Estimation: string | undefined;
  Times: number;
};

const Messages = {
  FROM_SERVER: {
    people: 'people',
    connect: 'connect',
    cards: 'cards',
    error: 'error',
    refresh: 'refresh'
  },
  TO_SERVER: {
    disconnect: 'disconnect',
    join_me: 'join_me',
    vote: 'vote',
    clear_votes: 'clear_votes',
    hide_unHide: 'hide_unHide',
    set_admin: 'set_admin'
  }
}

const RoomComponent = function () {
  let { id } = useParams();
  id = isUndefinedOrNull(id) ? '' : id;

  const [userName, setUserName] = useLocalStorage('userName', '');
  const [validRoom, setValidRoom] = useState<boolean>()
  const [validUserName, setValidUserName] = useState<boolean>()
  const [room, setRoom] = useState<RoomDTO | null | undefined>();
  const [roomHide, setRoomHide] = useState<boolean | null | undefined>();
  const [roomHasAdmin, setRoomHasAdmin] = useState<boolean>(false);
  const [isUserAdmin, setIsUserAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<ParticipantDTO>>([]);
  const [cards, setCards] = useState<Array<CardDTO>>([]);
  const [userVote, setUserVote] = useState<CardDTO | null | undefined>(null);
  const [connected, setConnected] = useState<boolean | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>('');
  const [error, setError] = useState<ErrorDTO>({});
  const [debug, setDebug] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<any>();
  const [voteSummary, setVoteSummary] = useState<Array<VoteSummary>>();
  const [wsServer, setWsServer] = useState(io(Config.SOCKET_SERVER, { autoConnect: false, reconnection: true }));
  const navigate = useNavigate();

  useEffect(() => {
    async function useEffectAsync() {
      let isValidRoom = false;
      if (validateUUID(id)) {
        const getRoomResult = await getRoom(id);
        isValidRoom = !isUndefinedOrNull(getRoomResult);
        setValidRoom(isValidRoom);
        setRoom(getRoomResult);
        setRoomHide(true);
        setRoomHasAdmin(!isUndefinedNullOrEmpty(getRoomResult.admin));
        setIsUserAdmin(getRoomResult?.admin === userName);
      }
      else {
        setValidRoom(isValidRoom);
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
    setUserName(sanitizeText(userName));

    return () => {
      if (wsServer.connected || !wsServer.disconnected) {
        wsServer.off(Messages.FROM_SERVER.connect, onConnectHandler);
        wsServer.off(Messages.FROM_SERVER.people, onPeopleHandler);
        wsServer.off(Messages.FROM_SERVER.cards, onCardsHandler);
        wsServer.off(Messages.FROM_SERVER.error, onErrorHandler);
        wsServer.off(Messages.FROM_SERVER.refresh, onRefreshHandler);
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
    console.log(`[${Messages.FROM_SERVER.people}]`, data, room);

    if (data.roomId === id) {
      setRoomHide(data.hide === true ? true : false);

      if (data.hide === false) {
        var sortedArray: ParticipantDTO[] = data.people.sort((n1, n2) => {
          return (isNaN(Number(n2.vote?.value)) ? -1 : Number(n2.vote?.value))
            - (isNaN(Number(n1.vote?.value)) ? -1 : Number(n1.vote?.value))
        });
        data.people = sortedArray;
        const voteValues = sortedArray.map((participant) => participant.vote?.value);
        const xVoteSummary: VoteSummary[] = [];

        voteValues.forEach((value) => {
          const existingVote = xVoteSummary.find((vote) => vote.Estimation === value);
          if (existingVote) {
            existingVote.Times++;
          } else {
            xVoteSummary.push({ Estimation: value, Times: 1 });
          }
        });
        console.log('voteSummary', xVoteSummary);
        setVoteSummary(xVoteSummary);
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

  const onRefreshHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.refresh}]`, data);
    if (data.roomId === id) {
      window.location.reload();
    }
  }

  const onVoteClick = function (value: CardDTO) {
    console.log(`[${Messages.TO_SERVER.vote}]`, value);
    wsServer.emit(Messages.TO_SERVER.vote, { roomId: id, userId: connectionId, vote: value });
    setUserVote(value);
  };

  const onClearAllClick = function () {
    wsServer.emit(Messages.TO_SERVER.clear_votes, { roomId: id });
  }

  const OnHideUnHideClick = function () {
    wsServer.emit(Messages.TO_SERVER.hide_unHide, { roomId: id });
  }

  const onSetRoomAdmin = function (e: any) {
    setRoomAdmin({ roomId: id, admin: e })
      .then((r) => {
        if (r === true) {
          wsServer.emit(Messages.TO_SERVER.set_admin, { roomId: id });
        }
      })
  }

  /* ---------- */

  const setWsEvents = function (socket: Socket): Socket {
    socket.on(Messages.FROM_SERVER.connect, onConnectHandler);
    socket.on(Messages.FROM_SERVER.people, onPeopleHandler);
    socket.on(Messages.FROM_SERVER.cards, onCardsHandler);
    socket.on(Messages.FROM_SERVER.error, onErrorHandler);
    socket.on(Messages.FROM_SERVER.refresh, onRefreshHandler)
    return socket;
  }

  const conntectWS = function () {
    setWsServer(wsServer.connect());
    setConnected(wsServer.connected);
    setConnectionId(wsServer.id);
  };

  const backToHome = () => {
    navigate('/', { replace: true });
    window.location.reload();
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
    <Box width={'100vw'} sx={{ paddingLeft: 4, paddingRight: 4 }}>

      {Config.IS_PRODUCTION === false && debug === true &&
        <>
          <Typography>{validRoom ? 'valid' : 'invalid'}</Typography>
          <Typography>{roomHide ? 'hide' : 'no hide'}</Typography>
          <Typography>
            {JSON.stringify(room)}
          </Typography>
        </>
      }

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
            gutterBottom
            onClick={() => { setDebug(!debug) }}>
            ROOM: {room?.name}
            {!isUndefinedNullOrEmpty(room?.admin) ? <> | Admin: {room?.admin}</> : <></>}
          </Typography>

          {(!connected || isUndefinedNullOrEmpty(connectionId)) &&
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50%" }}>
              <CircularProgress size={100} />
            </Box>}

          {
            !roomHide && voteSummary && voteSummary.length > 0 &&
            <Box display={'flex'} flexDirection={'column'} marginTop={2}>
              <Typography sx={{ fontSize: '1.5em', textAlign: 'center' }} color="text.secondary" gutterBottom>
                Vote Summary
              </Typography>
              <Box display={'flex'} flexDirection={'row'} justifyContent={'center'} flexWrap={'wrap'}>
                {voteSummary?.map((vote: VoteSummary) =>
                  <Box display={'flex'} flexDirection={'column'} alignItems={'center'} margin={1}>
                    <Typography sx={{ fontWeight: 'bold'}}>{vote.Estimation ?? 'N/A'}</Typography>
                    <Typography>{vote.Times}</Typography>
                  </Box>
                )}
              </Box>
              <Box textAlign='center'>
                Total Votes: {voteSummary?.reduce((total, vote) => total + vote.Times, 0)}
              </Box>
            </Box>
          }

          {connected && !isUndefinedNullOrEmpty(connectionId) &&
            <Box display={'flex'} flexDirection={'column'}>
              <Box style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {cards.map((card) =>
                  <CardComponent card={card} 
                    disabled={roomHide === false}
                    selected={userVote?.value === card.value}
                    onClick={() => { onVoteClick(card); }} />
                )}
              </Box>

              {
                roomHasAdmin === true && room?.admin === userName
                && (
                  <Box width={{ xs: '100%', s: '100%', md: '50%', l: '50%', xl: '50%' }}
                    marginTop={2}
                    display={'flex'}
                    justifyContent={'space-between'}
                    alignSelf={'center'}>
                    <Button variant="contained"
                      onClick={onClearAllClick}>Clear All</Button>
                    <Button variant="contained"
                      onClick={OnHideUnHideClick}>{roomHide === true ? 'Unhide' : 'Hide'}</Button>
                  </Box>
                )
              }
              <Box display='flex' justifyContent={'center'} mt={3}>
                <ResultsComponent onSetRoomAdmin={onSetRoomAdmin} roomHasAdmin={roomHasAdmin} isUserAdmin={isUserAdmin} connectionId={connectionId} users={[...new Set(users)]} />
              </Box>
            </Box>
          }
        </>
      }
    </Box>
  );
};

export default RoomComponent;
