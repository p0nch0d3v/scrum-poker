import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { RoomService } from './room.service';
import { NofityCardsDTO, JoinMeDTO, VoteDTO, RoomInfoDTO, NotifyPeopleDTO, ErrorDTO, ParticipantDTO, SerieDTO } from 'models'
import { SerieService } from '../serie/seire.service';

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

  constructor(
    private readonly roomService: RoomService,
    private readonly serieService: SerieService
  ) { }

  private readonly allRooms: Map<String, Array<ParticipantDTO>> = new Map();
  private readonly allRoomsInfo: Map<String, RoomInfoDTO> = new Map();
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on(Messages.FROM_CLIENT.disconnect, async (data: any) => {
      console.log(`[${Messages.FROM_CLIENT.disconnect}]`, socket.id, clientId, data);
      this.connectedClients.delete(clientId);

      for (let i = 0; i < this.allRooms.size; i++) {
        let roomId = (Array.from(this.allRooms.keys())[i]).toString();
        let room = this.allRooms.get(roomId);
        const hide: boolean = await this.getHideVotesRoom(data.roomId);

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
      const roomAdmin = await this.roomService.getAdmin(data.roomId);
      if (!this.allRooms.has(data.roomId)) {
        this.allRooms.set(data.roomId, []);
      }
      if (!this.allRoomsInfo.has(data.roomId)) {
        this.allRoomsInfo.set(data.roomId, new RoomInfoDTO(data.roomId, true, roomAdmin));
      }

      const hide: boolean = await this.getHideVotesRoom(data.roomId);
      if (this.allRooms.get(data.roomId).findIndex((e) => { return e.socketId == clientId }) === -1) {
        this.allRooms.get(data.roomId).push({ user: data.user, socketId: socket.id, vote: null, hide: hide, isAdmin: data.user.email === roomAdmin });
      }

      if (this.allRooms.get(data.roomId).findIndex((e) => {
        return e.user.email.trim().toLocaleLowerCase() === data.user.email.trim().toLocaleLowerCase()
          && e.socketId !== socket.id
      }) >= 0) {
        this.emitError(socket, data.roomId, `The username: [${data.user.email}] is already joined`);
      }
      else {
        socket.join(data.roomId);

        this.emitPeople(socket, data.roomId, hide, this.allRooms.get(data.roomId));
        await this.emitCards(socket, data.roomId);
      }
    });

    socket.on(Messages.FROM_CLIENT.vote, async (data: VoteDTO) => {
      console.log(`[${Messages.FROM_CLIENT.vote}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);
      const hide: boolean = await this.getHideVotesRoom(data.roomId);

      const index = room.findIndex((e) => { return e.socketId == data.userId });
      if (index > -1) {
        room[index]['vote'] = data.vote != null && data.vote.value !== null ? data.vote : null;
        this.emitPeople(socket, roomId, hide, this.allRooms.get(roomId));
      }
    });

    socket.on(Messages.FROM_CLIENT.clear_votes, async (data: RoomInfoDTO) => {
      console.log(`[${Messages.FROM_CLIENT.clear_votes}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);

      this.setHideVotesRoom(roomId, true);
      const currentHide = await this.getHideVotesRoom(roomId);

      for (let i = 0; i < room.length; i++) {
        const user = room[i];
        user.vote = null;
        user.hide = true;
      }
      this.emitPeople(socket, roomId, currentHide, this.allRooms.get(roomId));
    });

    socket.on(Messages.FROM_CLIENT.hide_unHide, async (data: RoomInfoDTO) => {
      console.log(`[${Messages.FROM_CLIENT.hide_unHide}]`, socket.id, clientId, data);
      const roomId = data.roomId
      let room = this.allRooms.get(roomId);

      this.setHideVotesRoom(roomId, await this.getHideVotesRoom(roomId) === true ? false : true)
      const currentHide = await this.getHideVotesRoom(roomId);

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
    const [savedSerie, savedValues] = await this.roomService.getCards(roomId);
    const serie = savedSerie.split(',');
    const values = savedValues.split(',');

    const wildcards = await this.serieService.getWildcard();

    let nofityCards: NofityCardsDTO = {
      'roomId': roomId,
      'cards': [
      ]
    };

    for (let i = 0; i < wildcards.length; i++) {
      const wildcard: SerieDTO = wildcards[i];
      const wildcardSerie = wildcard.serie.split(',');
      const wildcardValues = wildcard.values.split(',');
      for (let j = 0; j < wildcardSerie.length; j++) {
        nofityCards.cards.push({ text: wildcardSerie[j], value: this.parseValue(wildcardValues[j]) });
      }
    }

    for (let i = 0; i < serie.length; i++) {
      nofityCards.cards.push({ text: serie[i], value: this.parseValue(values[i]) });
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

  getHideVotesRoom = async function (roomId: string): Promise<boolean> {
    if (!this.allRoomsInfo.has(roomId)) {
      const roomAdmin = await this.roomService.getAdmin(roomId);
      this.allRoomsInfo.set(roomId, new RoomInfoDTO(roomId, true, roomAdmin));
    }
    const hide: boolean = this.allRoomsInfo.get(roomId).hide;
    return hide;
  }

  setHideVotesRoom = async function (roomId: string, newValue: boolean) {
    if (!this.allRoomsInfo.has(roomId)) {
      const roomAdmin = await this.roomService.getAdmin(roomId);
      this.allRoomsInfo.set(roomId, new RoomInfoDTO(roomId, newValue, roomAdmin));
    }
    this.allRoomsInfo.get(roomId).hide = newValue;
  }

   parseValue = function(input: string): string | null | undefined {
    let value = undefined;
    if (input == 'undefined') {
      value = undefined;
    }
    else if (input == 'null') {
      value = null;
    }
    else {
      value = input;
    }
    return value;
  }

  // Add more methods for handling events, messages, etc.
}
