import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class SocketService {
  private readonly allRooms: Map<String, Array<any>> = new Map();
  private readonly connectedClients: Map<string, Socket> = new Map();

  handleConnection(socket: Socket): void {
    const clientId = socket.id;
    this.connectedClients.set(clientId, socket);

    socket.on('disconnect', (data: any) => {
      console.log('[disconnect]', socket.id, clientId);
      this.connectedClients.delete(clientId);

      for (let i = 0; i < this.allRooms.size; i++) {
        let roomId = (Array.from(this.allRooms.keys())[i]).toString();
        let room = this.allRooms.get(roomId);
        const index = room.findIndex((e) => { return e.socketId == clientId });
        if (index > -1) {
          room.splice(index, 1);
          console.log(`disconnected from [${roomId}`)
          this.emitJoned(socket, roomId, this.allRooms.get(roomId));
        }
      }
    });

    socket.on('join_me', (data: any) => {
      console.log('[join_me]', socket.id, clientId, data.roomId);
      if (!this.allRooms.has(data.roomId)) {
        this.allRooms.set(data.roomId, []);
      }
      this.allRooms.get(data.roomId).push({ userName: data.userName, socketId: socket.id });

      socket.join(data.roomId);

      this.emitJoned(socket, data.roomId, this.allRooms.get(data.roomId));
    });

    // Handle other events and messages from the client
  }

  emitJoned = function(socket: Socket, roomId: string, people: Array<any>){
    const nofityJoined:any = { 
      'roomId': roomId, 
      'people': this.allRooms.get(roomId) 
    };

    socket.emit('joined', nofityJoined);
    socket.broadcast.emit('joined', nofityJoined);
    socket.to(roomId).emit('joined', nofityJoined);
    socket.to(socket.id).emit('joined', nofityJoined);
  }

  // Add more methods for handling events, messages, etc.
}