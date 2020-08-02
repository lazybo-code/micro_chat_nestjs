import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
  WsResponse,
} from '@nestjs/websockets';
import { Namespace, Server, Socket } from 'socket.io';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TokenUtil } from '../utils/token.util';
import { Global } from '@nestjs/common';
import { User } from '../entitys/user.entity';

@Global()
@WebSocketGateway()
export class EventsGateway {
  constructor(private tokenUtil: TokenUtil) {}

  @WebSocketServer()
  server: Server;

  async handleConnection(client: Socket) {
    const socket = client.conn;
    const socketId = socket.id;
    const query = socket.request._query;
    if (Object.keys(query).findIndex(v => v.toLocaleLowerCase() === 'authorization') == -1) {
      client.to(socketId).disconnect(true);
      return;
    }
    const authorization = query['authorization'] || null;
    if (authorization == null) {
      client.to(socketId).disconnect(true);
      return;
    }
    const userToken = authorization.split(' ')[1];
    if (userToken == null) {
      client.to(socketId).disconnect(true);
      return;
    }
    const user = await this.tokenUtil.getUserByToken(userToken);
    if (user == null) {
      client.to(socketId).disconnect(true);
      return;
    }
    await this.tokenUtil.createSocketIdAndUser(socketId, userToken);
  }

  async sendMessage(userId: number, event: string, param: Record<string, any>) {
    const socketIds = await this.tokenUtil.getSocketIdByUserId(userId);
    const status = socketIds.map(v => this.server.to(v).emit(event, param) as unknown as Namespace);
    const filter = status.filter(v => Object.keys(v.sockets).length > 0);
    return {
      status: filter.length > 0,
      success: filter.length,
      error: status.length - filter.length,
    };
  }

  /**
   * @Description 发送好友申请
   * @param userId {Number} 收消息方
   * @param userInfo {Object} 发消息方数据
   */
  async sendFriendApply(userId: number, userInfo: Record<string, any>) {
    return await this.sendMessage(userId, 'friend', {
      status: 'apply',
      user: userInfo,
    });
  }

  /**
   * @Description 拒绝好友申请
   * @param userId {Number} 收消息方
   * @param userInfo {Object} 发消息方数据
   * @param refusal {String} 拒绝信息
   */
  async sendFriendRefusal(
    userId: number,
    userInfo: Record<string, any>,
    refusal?: string,
  ) {
    return await this.sendMessage(userId, 'friend', {
      status: 'refusal',
      user: userInfo,
      refusal,
    });
  }

  /**
   * @Description 同意好友申请
   * @param userId {Number} 收消息方
   * @param userInfo {Object} 发消息方数据
   */
  async sendFriendAgree(userId: number, userInfo: Record<string, any>) {
    return await this.sendMessage(userId, 'friend', {
      status: 'agree',
      user: userInfo,
    });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!123';
  }

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('identity')
  async identity(@MessageBody() data: number): Promise<number> {
    return data;
  }
}
