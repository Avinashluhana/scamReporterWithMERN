import { JwtService } from "@nestjs/jwt";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { AppLogger } from "src/app.logger";
import { IAuthUser } from "src/auth/interface/user.interface";
import { JoinChatDto } from "./dtos/join-chat.dto";
import { MessageOutDto } from "./dtos/message-out.dto";
import { ClientEvents, ServerEvents } from "./socker.events";

@WebSocketGateway({ namespace: 'support', cors: { origin: true } })
export class SupportGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  private readonly logger = new AppLogger(WebSocketGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  private readonly connectedUsers = {};

  @WebSocketServer()
  io: Server;

  afterInit(server: Server) {
    this.logger.log(`${this.afterInit.name} was called`);
  }

  async handleConnection(client: Socket, ...args: any[]) {
    try {
      this.logger.log(`${this.handleConnection.name} was called`);

      const bearerToken: string = client.handshake.headers['authorization'];
      if (!bearerToken) throw new Error('Authorization header not found');

      const token = bearerToken.split(/\s+/)[1].trim();
      if (!token) throw new Error('Bearer token not found');

      const authUser: IAuthUser = await this.jwtService.verify(token);
      this.connectedUsers[authUser.sub] = client.id;

    } catch (error) {
      client.emit('exception', { name: 'Error', message: error.message });
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`${this.handleDisconnect.name} was called`);
  }

  @SubscribeMessage(ClientEvents.chat.join)
  async joinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() input: JoinChatDto,
  ) {
    this.logger.log(`${this.joinChat.name} was called by socket.client: '${client.id}'`);
    // leave all other chat and join new chat
    client.rooms.clear();
    client.join(input.chatId);
    client.emit(ServerEvents.notification.new, { message: 'joined chat' });
  }

  chatMessage(chatId: string, event: string, message: MessageOutDto) {
    this.logger.log(`${this.chatMessage.name} was called`);
    this.io.to(chatId).emit(event, message);
  }

  emitToUsers(userIds: string[], event: string, data: any) {
    this.logger.log(`${this.emitToUsers.name} was called...`);
    const socketids = userIds.map( userId => this.connectedUsers[userId] );
    for (const socketid of socketids) {
      this.io.to(socketid).emit(event, data);
    }
  }

}