import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { Repository } from 'typeorm';
import { Friends } from '../entitys/friends.entity';
import { EventsGateway } from '../events/events.gateway';
import { TokenUtil } from '../utils/token.util';
import { PutStatusFriendDto } from './friends.dto';
import { getFirstFight, getLetter } from '../utils/basis.util';
import moment = require('moment-timezone');

@Injectable()
export class FriendsService {
  constructor(
    private tokenUtil: TokenUtil,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    private eventsGateway: EventsGateway,
  ) {}

  private friendSelect = [
    'friends.userId',
    'friends.friend',
    'friends.remark',
    'friends.status',
    'friends.refusal',
    'user.nickname',
    'user.username',
    'user.avatar',
    'user.signature',
    'friends.description',
    'friends.createdTime',
    'friends.updatedTime',
  ];

  async getApplyFriends(id: number) {
    return await this.friendsRepository
      .createQueryBuilder('friends')
      .innerJoin(User, 'user', 'user.id = friends.userId')
      .where('friends.friendId = :userId', { userId: id })
      .andWhere('friends.deletedTime is null')
      .andWhere('friends.createdTime < :current', { current: moment().add(1, 'months').format() })
      .select(this.friendSelect)
      .orderBy('friends.createdTime', 'DESC')
      .getRawMany();
  }

  async getFriends(id: number) {
    const data = await this.friendsRepository
      .createQueryBuilder('friends')
      .innerJoin(User, 'user', 'user.id = friends.friendId')
      .where('friends.userId = :userId', { userId: id })
      .andWhere('friends.status = :status', { status: 'agree' })
      .andWhere('friends.deletedTime is null')
      .select(this.friendSelect)
      .getRawMany();
    const res: {[key: string]: any} = {};
    getLetter().forEach(v => res[v] = []);
    res['#'] = [];
    data.forEach(friend => {
      if (friend.friends_remark != null && friend.friends_remark.length > 0) {
        const pinyin = getFirstFight(friend.friends_remark).toLocaleUpperCase();
        res[pinyin].push(friend);
        return;
      }
      if (friend.user_nickname != null && friend.user_nickname.length > 0) {
        const pinyin = getFirstFight(friend.user_nickname).toLocaleUpperCase();
        res[pinyin].push(friend);
        return;
      }
      res['#'].push(friend);
      return;
    });
    return res;
  }

  async putStatusFriend(userId: number, param: PutStatusFriendDto) {
    // 如果好友状态修改 通过, 就新增 -> friendId = 当前userId . userId = friendId 并修改 status
    // 如果拒绝 就记录拒绝原因
    const myFriend = await this.friendsRepository.findOne({
      friend: userId,
      user: param.friendId,
      status: 'apply',
    });
    if (myFriend == null) {
      throw new BadRequestException('状态修改失败, 重复修改');
    }
    const update = await this.friendsRepository.update(myFriend.id, {
      status: param.status,
      refusal: param.refusal,
    });
    if (update.raw.changedRows == 0) {
      throw new BadRequestException('状态修改失败, 未知错误');
    }
    const {
      password,
      createdTime,
      updatedTime,
      deletedTime,
      ...other
    } = await this.usersRepository.findOne(userId);
    if (param.status == 'agree') {
      // 添加对方
      await this.friendsRepository.insert({
        friend: param.friendId,
        user: userId,
        status: 'agree',
      });
      await this.eventsGateway.sendFriendAgree(param.friendId, other);
    } else {
      await this.eventsGateway.sendFriendRefusal(
        param.friendId,
        other,
        param.refusal,
      );
    }
  }

  async addFriend(userId: number, friendId: number, description: string, remark?: string) {
    const friendInfo = await this.usersRepository.findOne(friendId);
    if (friendInfo == null) {
      throw new BadRequestException('添加失败, 不存在的好友');
    }
    const friend = await this.friendsRepository.findOne({
      user: userId,
      friend: friendId,
    });
    if (friend != null) {
      if (friend.status == 'refusal') {
        // 更新申请
        await this.friendsRepository.update(friend.id, {
          status: 'apply',
          refusal: null,
          description
        });
      }
      if (friend.status == 'apply') {
        throw new BadRequestException('申请发送过,请等待对方同意');
      }
      if (friend.status == 'agree') {
        throw new BadRequestException('对方已是好友');
      }
    } else {
      await this.friendsRepository.insert({
        user: userId,
        friend: friendId,
        description,
        remark,
        status: 'apply',
      });
    }
    const {
      password,
      createdTime,
      updatedTime,
      deletedTime,
      ...param
    } = await this.usersRepository.findOne(userId);
    // 发送socket申请
    await this.eventsGateway.sendFriendApply(friendId, param);
  }

  async deleteFriend(userId: number, friendId: number) {
    const myFriend = await this.friendsRepository.findOne({
      user: userId,
      friend: friendId,
      status: 'agree',
      deletedTime: null,
    });
    if (myFriend == null) {
      throw new BadRequestException('好友不存在');
    }
    return await this.friendsRepository.update(myFriend, {
      deletedTime: new Date(),
    });
  }

  async queryFriends(userId: number, query: string) {
    return await this.usersRepository.createQueryBuilder('user')
      .leftJoin(Friends, 'friend', 'friend.userId = :userId and friend.friendId = user.id', { userId })
      .where('user.id <> :userId', { userId })
      .andWhere('(user.nickname like :query or user.username like :query)', { query: `%${query.trim()}%` })
      .select([
        'user.id',
        'user.nickname',
        'user.username',
        'user.avatar',
        'user.signature',
        'friend.status',
        'friend.remark',
      ])
      .getRawMany();
  }
}
