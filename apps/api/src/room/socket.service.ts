import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { CardDTO, NofityCardsDTO, JoinMeDTO, VoteDTO, RoomInfoDTO, NotifyPeopleDTO, ErrorDTO } from 'models'
import { ParticipantDTO } from 'models';

const Messages = {
  TO_CLIENT: {
    people: 'people',
    cards: 'cards',
    error: 'error',
    refresh: 'refresh'
  },
  FROM_CLIENT: {
    disconnect: 'disconnect',
    join_me: 'join_me',
    vote: 'vote',
    clear_votes: 'clear_votes',
    hide_unHide: 'hide_unHide',
    set_admin: 'set_admin'
  }
}

@Injectable()
export class SocketService {

  constructor(private readonly roomService: RoomService) { }

  private readonly allRooms: Map<String, Array<ParticipantDTO>> = new Map();
  private readonly allRoomsInfo: Map<String, RoomInfoDTO> = new Map();
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on(Messages.FROM_CLIENT.disconnect, (data: any) => {
      console.log(`[${Messages.FROM_CLIENT.disconnect}]`, socket.id, clientId, data);
      this.connectedClients.delete(clientId);

      for (let i = 0; i < this.allRooms.size; i++) {
        let roomId = (Array.from(this.allRooms.keys())[i]).toString();
        let room = this.allRooms.get(roomId);
        const hide: boolean = this.getHideVotesRoom(data.roomId);

        const index = room.findIndex((e) => { return e.socketId == clientId });
        if (index > -1) {
          room.splice(index, 1);
          console.log(`disconnected from [${roomId}`)
          this.emitPeople(socket, roomId, hide, this.allRooms.get(roomId));
        }
      }
    });

    socket.on(Messages.FROM_CLIENT.join_me, async (data: JoinMeDTO) => {
      console.log(`[${Messages.FROM_CLIENT.join_me}]`, socket.id, clientId, data);
      if (!this.allRooms.has(data.roomId)) {
        this.allRooms.set(data.roomId, []);
      }
      if (!this.allRoomsInfo.has(data.roomId)) {
        this.allRoomsInfo.set(data.roomId, new RoomInfoDTO(data.roomId, true));
      }

      const hide: boolean = this.getHideVotesRoom(data.roomId);
      if (this.allRooms.get(data.roomId).findIndex((e) => { return e.socketId == clientId }) === -1) {
        this.allRooms.get(data.roomId).push({ userName: data.userName, socketId: socket.id, vote: null, hide: hide });
      }

      if (this.allRooms.get(data.roomId).findIndex((e) => {
        return e.userName.trim().toLocaleLowerCase() === data.userName.trim().toLocaleLowerCase()
          && e.socketId !== socket.id
      }) >= 0) {
        this.emitError(socket, data.roomId, `The username: [${data.userName}] is already joined`);
      }
      else {
        socket.join(data.roomId);

        this.emitPeople(socket, data.roomId, hide, this.allRooms.get(data.roomId));
        await this.emitCards(socket, data.roomId);
      }
    });

    socket.on(Messages.FROM_CLIENT.vote, (data: VoteDTO) => {
      console.log(`[${Messages.FROM_CLIENT.vote}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);
      const hide: boolean = this.getHideVotesRoom(data.roomId);

      const index = room.findIndex((e) => { return e.socketId == data.userId });
      if (index > -1) {
        room[index]['vote'] = data.vote.value !== null ? data.vote : null;
        this.emitPeople(socket, roomId, hide, this.allRooms.get(roomId));
      }
    });

    socket.on(Messages.FROM_CLIENT.clear_votes, (data: RoomInfoDTO) => {
      console.log(`[${Messages.FROM_CLIENT.clear_votes}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);

      this.setHideVotesRoom(roomId, true);
      const currentHide = this.getHideVotesRoom(roomId);

      for (let i = 0; i < room.length; i++) {
        const user = room[i];
        user.vote = null;
        user.hide = true;
      }
      this.emitPeople(socket, roomId, currentHide, this.allRooms.get(roomId));
    });

    socket.on(Messages.FROM_CLIENT.hide_unHide, (data: RoomInfoDTO) => {
      console.log(`[${Messages.FROM_CLIENT.hide_unHide}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);

      this.setHideVotesRoom(roomId, !this.getHideVotesRoom(roomId))
      const currentHide = this.getHideVotesRoom(roomId);

      for (let i = 0; i < room.length; i++) {
        const user = room[i];
        user.hide = currentHide;
      }
      this.emitPeople(socket, roomId, currentHide, this.allRooms.get(roomId));
    });

    socket.on(Messages.FROM_CLIENT.set_admin, (roomId: string) => {
      console.log(`[${Messages.FROM_CLIENT.set_admin}]`, socket.id, roomId);
      this.emitAdmin(socket, roomId);
    });
  }

  emitPeople = function (socket: Socket, roomId: string, hideVotes: boolean, people: Array<ParticipantDTO>) {
    const nofityJoined: NotifyPeopleDTO = {
      roomId: roomId,
      hide: hideVotes,
      people: people
    };

    socket.emit(Messages.TO_CLIENT.people, nofityJoined);
    socket.broadcast.emit(Messages.TO_CLIENT.people, nofityJoined);
    socket.to(roomId).emit(Messages.TO_CLIENT.people, nofityJoined);
    socket.to(socket.id).emit(Messages.TO_CLIENT.people, nofityJoined);
  }

  emitCards = async function (socket: Socket, roomId: string) {
    const savedCards = await this.roomService.getCards(roomId);
    let cards = savedCards.split(',');

    let nofityCards: NofityCardsDTO = {
      'roomId': roomId,
      'cards': [
        { text: '☕️', value: '☕️' },
        { text: '?', value: '?' },
        { text: '♾️', value: '♾️' },
        { text: '-', value: null }
      ]
    };

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      nofityCards.cards.push({ text: card, value: card });
    }

    socket.emit(Messages.TO_CLIENT.cards, nofityCards);
    socket.to(socket.id).emit(Messages.TO_CLIENT.cards, nofityCards);
  }

  emitError = async function (socket: Socket, roomId: string, errorMessage: string) {
    let error: ErrorDTO = {
      message: errorMessage,
      socketId: socket.id,
      roomId: roomId
    };

    socket.emit(Messages.TO_CLIENT.error, error);
    socket.to(socket.id).emit(Messages.TO_CLIENT.error, error);
  }

  emitAdmin = async function (socket: Socket, roomId: string) {
    socket.emit(Messages.TO_CLIENT.refresh, roomId);
    socket.broadcast.emit(Messages.TO_CLIENT.refresh, roomId);
    socket.to(roomId).emit(Messages.TO_CLIENT.refresh, roomId);
    socket.to(socket.id).emit(Messages.TO_CLIENT.refresh, roomId);
  }

  getHideVotesRoom = function (roomId: string): boolean {
    if (!this.allRoomsInfo.has(roomId)) {
      this.allRoomsInfo.set(roomId, new RoomInfoDTO(roomId, true));
    }
    const hide: boolean = this.allRoomsInfo.get(roomId).hide;
    return hide;
  }

  setHideVotesRoom = function (roomId: string, newValue: boolean) {
    if (!this.allRoomsInfo.has(roomId)) {
      this.allRoomsInfo.set(roomId, new RoomInfoDTO(roomId, newValue));
    }
    this.allRoomsInfo.get(roomId).hide = newValue;
  }

  // Add more methods for handling events, messages, etc.
}
