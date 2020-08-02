import * as crypto from 'crypto';
import { CacheService } from '../cache/cache.service';
import { v1 } from 'uuid';
import { Global, Injectable } from '@nestjs/common';

export type ITokenType = 'app' | 'web' | 'pc';

export interface ICreateUserToken {
  type: ITokenType;
  id: number;

  [key: string]: any;
}

@Global()
@Injectable()
export class TokenUtil {
  constructor(private cacheService: CacheService) {}

  async getSocketIdByUserId(userId: number): Promise<Array<string>> {
    const pushKey = ['app', 'web', 'pc'];
    const token = (
      await Promise.all(
        pushKey.map(v => this.cacheService.get(`userId:${v}:${userId}`)),
      )
    ).filter(v => v != null);
    return await Promise.all(
      token.map(v => this.cacheService.get(`socket:${v}:token`)),
    );
  }

  async createSocketIdAndUser(socketId: string, userToken: string) {
    // 记录socketId
    await this.cacheService.set(`socket:${userToken}:token`, socketId, 172800);
    // 关联socketId 与 用户token
    return await this.cacheService.set(
      `socket:${socketId}:id`,
      userToken,
      172800,
    );
  }

  /// 两组数据 -> userId => token, token => { userId ... }
  async createUserToken(param: ICreateUserToken): Promise<string> {
    const key = `userId:${param.type}:${param.id}`;
    const oldToken = await this.cacheService.get(key);
    if (oldToken != null) {
      await this.cacheService.del(key);
      await this.cacheService.del(oldToken);
    }
    const token = crypto
      .createHash('sha256')
      .update(`${v1()}${param}${key}`)
      .digest('hex');
    await this.cacheService.set(key, token, 172800);
    await this.cacheService.set(token, param, 172800);
    return token;
  }

  async getUserByToken(token: string): Promise<ICreateUserToken> {
    const param = await this.cacheService.get(token);
    if (param != null) {
      param._pttl = await this.cacheService.pttl(token);
    }
    return param;
  }

  async getUserBySocketId(socketId: string) {
    const userToken = await this.cacheService.get(socketId);
    if (userToken == null) return null;
    return this.getUserByToken(userToken);
  }
}
