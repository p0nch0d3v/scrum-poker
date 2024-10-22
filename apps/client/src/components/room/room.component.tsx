import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Socket, io } from 'socket.io-client';

import { CardDTO, ErrorDTO, NofityCardsDTO, NotifyPeopleDTO, ParticipantDTO, RoomDTO, SetAdminDTO } from "models";
import Config from "../../config/config";
import { isUndefinedNullOrEmpty, isUndefinedOrNull, shuffleArray } from "../../helpers/helpers";
import { getRoom, setRoomAdmin } from '../../services/api.service';
import CardComponent from "../card/card.component";
import ErrorModalComponent from "../invalidRoomModal/errorModal.component";
import ParticipantListComponent from "../participantList/participantList.component";
import VoteSummaryComponent from "../voteSummary/voteSummary.component";
import ShowSetAdminModalComponent from "../setAdminModal/setAdminModal.component";
import useSessionStorage from "../../hooks/useSessionStorage";
import { UserDTO } from "models";

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
  let { paramId } = useParams();
  paramId = isUndefinedOrNull(paramId) ? '' : paramId;

  const [user] = useSessionStorage<UserDTO | null>("user", null);
  const [validRoom, setValidRoom] = useState<boolean>()
  const [validUserName, setValidUserName] = useState<boolean>()
  const [room, setRoom] = useState<RoomDTO | null | undefined>();
  const [roomId, setRoomId] = useState<string | null | undefined>('');
  const [roomName, setRoomName] = useState<string | null | undefined>('');
  const [roomHide, setRoomHide] = useState<boolean | null | undefined>();
  const [roomHasAdmin, setRoomHasAdmin] = useState<boolean>(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<ParticipantDTO>>([]);
  const [cards, setCards] = useState<Array<CardDTO>>([]);
  const [userVote, setUserVote] = useState<CardDTO | null | undefined>(null);
  const [showSetAdminModal, setShowSetAdminModal] = useState<boolean>(false);
  const [newAdminName, setNewAdminName] = useState<string>("");
  const [connected, setConnected] = useState<boolean | undefined>();
  const [connectionId, setConnectionId] = useState<string | undefined>('');
  const [error, setError] = useState<ErrorDTO>({});
  const [debug, setDebug] = useState<boolean>(false);
  const [intervalId, setIntervalId] = useState<any>();
  const [wsServer, setWsServer] = useState(io(Config.SOCKET_SERVER, { autoConnect: false, reconnection: true }));
  const navigate = useNavigate();

  useEffect(() => {
    async function useEffectAsync() {
      let isValidRoom = false;
      // if (validateUUID(id)) {
      const getRoomResult = await getRoom(paramId);
      isValidRoom = !isUndefinedOrNull(getRoomResult);
      if (isValidRoom === true) {
        setValidRoom(isValidRoom);
        setRoom(getRoomResult);
        setRoomId(getRoomResult?.id);
        setRoomName(getRoomResult.name || '');
        setRoomHide(true);
        setRoomHasAdmin(!isUndefinedNullOrEmpty(getRoomResult.admin));
        setIsCurrentUserAdmin(getRoomResult?.admin === user?.email);
      }
      else {
        setValidRoom(isValidRoom);
      }
    }
    useEffectAsync();

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
    if (validRoom
      && !isUndefinedNullOrEmpty(user?.email)
      && !isUndefinedNullOrEmpty(roomId)
      && !isUndefinedNullOrEmpty(roomName)
    ) {
      setConnected(wsServer.connected);
      setConnectionId(wsServer.id)

      if (!connected) {
        const _interval_id = setInterval(conntectWS, 500);
        setIntervalId(_interval_id);
      }
      setWsServer(setWsEvents(wsServer));
    }
  }, [roomId, roomName, validRoom]);

  useEffect(() => {
    if (wsServer.connected === true || !isUndefinedNullOrEmpty(connectionId)) {
      clearInterval(intervalId);
    };
  }, [connected, connectionId])

  useEffect(() => {
    if (error?.message && (error.roomId !== roomId || (connectionId && error.socketId !== connectionId))) {
      setError({})
    }
  }, [error, connectionId])

  /* ---------- */

  const onConnectHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.connect}]`, data);
    wsServer.emit(Messages.TO_SERVER.join_me, { roomId: roomId, user: user });
    // let usersTmp = Array<ParticipantDTO>();
    // usersTmp.push({ socketId: connectionId, userName: userName, vote: undefined, hide: users[0].hide });
    // setUsers(usersTmp);
  };

  const onPeopleHandler = function (data: NotifyPeopleDTO) {
    console.log(`[${Messages.FROM_SERVER.people}]`, data, room);

    if (data.roomId === roomId) {
      setRoomHide(data.hide === true ? true : false);

      if (data.hide === false) {
        var sortedArray: ParticipantDTO[] = data.people.sort((n1, n2) => {
          return (isNaN(Number(n2.vote?.value)) ? -1 : Number(n2.vote?.value))
            - (isNaN(Number(n1.vote?.value)) ? -1 : Number(n1.vote?.value))
        });
        data.people = sortedArray;
      }
      setUsers(data.people);
      if (data.people.some((p) => p.user.email === user?.email && p.vote === null)) {
        setUserVote(null);
      }
    }
  };

  const onCardsHandler = function (data: NofityCardsDTO) {
    console.log(`[${Messages.FROM_SERVER.cards}]`, data);
    if (data.roomId === roomId) {
      setCards(shuffleArray(data.cards));
    }
  }

  const onErrorHandler = function (data: ErrorDTO) {
    setError(data);
  }

  const onRefreshHandler = function (data: any) {
    console.log(`[${Messages.FROM_SERVER.refresh}]`, data);
    if (data.roomId === roomId) {
      window.location.reload();
    }
  }

  const onVoteClick = function (card: CardDTO | null) {
    if (userVote?.value !== card?.value) {
      console.log(`[${Messages.TO_SERVER.vote}]`, card);
      wsServer.emit(Messages.TO_SERVER.vote, { roomId: roomId, userId: connectionId, vote: card });
      setUserVote(card);
    }
  };

  const onClearAllClick = function () {
    wsServer.emit(Messages.TO_SERVER.clear_votes, { roomId: roomId });
  }

  const OnHideUnHideClick = function () {
    wsServer.emit(Messages.TO_SERVER.hide_unHide, { roomId: roomId });
  }

  const onSetRoomAdmin = function (e: string) {
    setShowSetAdminModal(true);
    setNewAdminName(e);
  }

  const onConfirmSetRoomAdmin = function (e: string) {
    setRoomAdmin({ roomId: roomId, admin: e } as SetAdminDTO)
      .then((r) => {
        if (r === true) {
          wsServer.emit(Messages.TO_SERVER.set_admin, { roomId: roomId });
        }
      });
  };

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

  return (
    <Box width={'100vw'} height={'calc(100vh - 64px)'} sx={{ paddingLeft: 4, paddingRight: 4 }}>

      {Config.IS_PRODUCTION === false && debug === true &&
        <>
          <Typography>{validRoom ? 'valid' : 'invalid'}</Typography>
          <Typography>{roomHide ? 'hide' : 'no hide'}</Typography>
          <Typography>{isCurrentUserAdmin === true ? 'isCurrentUserAdmin' : ''}</Typography>
          <Typography>
            {JSON.stringify(room)}
          </Typography>
        </>
      }

      {validRoom === false && <ErrorModalComponent
        open={validRoom === false}
        onClose={backToHome}
        message="Invalid room Id" />}


      {error !== null && !isUndefinedNullOrEmpty(error.message)
        && <ErrorModalComponent open={!isUndefinedNullOrEmpty(error.message)}
          onClose={backToHome}
          message={error?.message} />}

      {validRoom === true && !isUndefinedNullOrEmpty(user?.email) && !error.message &&
        <>
          {showSetAdminModal &&
            <ShowSetAdminModalComponent
              open={showSetAdminModal}
              newAdminName={newAdminName}
              onYes={onConfirmSetRoomAdmin}
              onNo={() => { setShowSetAdminModal(false); }} />
          }

          <Typography sx={{ fontSize: '1em', textAlign: 'center', marginTop: '1em' }}
            color="text.secondary"
            gutterBottom
            onClick={() => { setDebug(!debug) }}>
            ROOM: {roomName}
            {!isUndefinedNullOrEmpty(room?.admin) ? <> | Admin: {room?.admin}</> : <></>}
          </Typography>

          {(!connected || isUndefinedNullOrEmpty(connectionId)) &&
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", height: "50%" }}>
              <CircularProgress size={100} />
            </Box>}

          {connected && !isUndefinedNullOrEmpty(connectionId) &&
            <Box display={'flex'} flexDirection={'column'}>
              <Box style={{ display: 'flex', justifyContent: 'space-evenly', flexWrap: 'wrap' }}>
                {cards.map((card) =>
                  <CardComponent card={card}
                    disabled={roomHide === false || roomHasAdmin == false}
                    selected={userVote?.value === card.value}
                    onClick={() => { onVoteClick(card); }} />
                )}
              </Box>

              <Box width={{ xs: '100%', s: '100%', md: '50%', l: '50%', xl: '50%' }}
                marginTop={2}
                display={'flex'}
                justifyContent={'space-between'}
                alignSelf={'center'}>
                <Button variant="contained"
                  onClick={onClearAllClick}
                  disabled={roomHasAdmin !== true || room?.admin !== user?.email}>
                  Clear All
                </Button>
                {roomHasAdmin === false &&
                  <Typography variant="h6" component="h6" color="warning"
                    style={{ fontStyle: 'italic', fontWeight: 900, color:'#ba8e23' }}>
                    No admin set, click on any user to set as Admin
                  </Typography>}
                <Button variant="contained"
                  onClick={OnHideUnHideClick}
                  disabled={roomHasAdmin !== true || room?.admin !== user?.email}>
                  {roomHide === true ? 'Unhide' : 'Hide'}
                </Button>
              </Box>

              {(roomHide === false || isCurrentUserAdmin) && <VoteSummaryComponent users={users} />}

              {roomHide === true && <ParticipantListComponent
                users={users}
                isCurrentUserAdmin={isCurrentUserAdmin}
                roomHasAdmin={roomHasAdmin}
                onSetRoomAdmin={onSetRoomAdmin} />}
            </Box>
          }
        </>
      }
    </Box>
  );
};

export default RoomComponent;
