import { WebSocketGateway, OnGatewayConnection, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/' })
export class SocketGateway implements OnGatewayConnection {
  @WebSocketServer()
  private server: Socket;

  constructor(private readonly socketService: SocketService) { }

  handleConnection(socket: Socket): void {
    this.socketService.handleConnection(socket);
  }

  // Implement other Socket.IO event handlers and message handlers
}