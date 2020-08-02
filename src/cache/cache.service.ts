import { Injectable } from '@nestjs/common';
import { RedisService } from 'nestjs-redis';
import * as Redis from 'ioredis';

@Injectable()
export class CacheService {
  private client: Redis.Redis;

  constructor(private redisService: RedisService) {
    this.getClient().then(() => {});
  }

  private async getClient() {
    if (this.client != null) return;
    this.client = await this.redisService.getClient();
  }

  /**
   * @Description: 封装设置redis缓存的方
   * @param key {String} key值
   * @param value {String} key的值
   * @param seconds {Number} 过期时间
   * @return: Promise<any>
   */
  public async set(key: string, value: any, seconds?: number): Promise<any> {
    value = JSON.stringify(value);
    await this.getClient();
    if (!seconds) {
      await this.client.set(key, value);
    } else {
      await this.client.set(key, value, 'EX', seconds);
    }
  }

  /**
   * @Description: 设置获取redis缓存中的值
   * @param key
   */
  public async get(key: string): Promise<any> {
    await this.getClient();

    const data = await this.client.get(key);

    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  /**
   * @Description: 根据key删除redis缓存数据
   * @param key {String}
   */
  public async del(key: string): Promise<any> {
    await this.getClient();

    await this.client.del(key);
  }

  /**
   * @Description: 清空redis的缓存
   */
  public async flushall(): Promise<any> {
    await this.getClient();
    await this.client.flushall();
  }

  /**
   * @Description: 读取key的即将过期时间
   * @param key {String}
   */
  public async pttl(key: string): Promise<number> {
    await this.getClient();
    return await this.client.pttl(key);
  }
}
