import { BadRequestException, Injectable } from '@nestjs/common';
import { TokenUtil } from '../utils/token.util';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { Repository } from 'typeorm';
import { Friends } from '../entitys/friends.entity';
import { EventsGateway } from '../events/events.gateway';
import { GetMessageDto, SendTextMessageDto } from './message.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Message } from '../schemas/message.schema';

@Injectable()
export class MessageService {
  constructor(
    private tokenUtil: TokenUtil,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Friends)
    private friendsRepository: Repository<Friends>,
    @InjectModel(Message.name) private messageModel: Model<Message>,
    private eventsGateway: EventsGateway,
  ) {
  }

  async getMessage(user: User, param: GetMessageDto) {
    if (param.page == null || param.page <= 1) {
      param.page = 1;
    }
    if (param.limit || param.limit == 0) {
      param.limit = 30;
    }
    return await this.messageModel.find({
      $or: [
        {
          userId: param.friendId,
          friendId: user.id,
        },
        {
          userId: user.id,
          friendId: param.friendId,
        },
      ],
    })
      .sort({ createTime: -1 })
      .skip((param.page - 1) * param.limit)
      .limit(param.limit)
      .exec();
  }

  async sendTextMessage(user: User, param: SendTextMessageDto) {
    // 判断我是否他的好友, 他是否也是我的好友
    const myFriend = await this.friendsRepository.createQueryBuilder('friends')
      .leftJoin(Friends, 'friend2', 'friend2.userId = friends.friendId and friend2.friendId = friends.userId and friend2.status = friends.status and friend2.deletedTime = friends.deletedTime')
      .where('friends.userId = :userId', { userId: user.id })
      .andWhere('friends.friendId = :friendId', { friendId: param.friendId })
      .andWhere('friends.status = :status', { status: 'agree' })
      .andWhere('friends.deletedTime is null')
      .getCount();
    if (myFriend == 0) {
      throw new BadRequestException('非好友, 消息发送失败');
    }
    const message = new this.messageModel({
      userId: user.id,
      friendId: param.friendId,
      type: 'text',
      text: {
        text: param.text,
      },

    });
    const text = await message.save();
    await this.eventsGateway.sendMessage(param.friendId, 'message', {
      text,
      user,
      message: 'text',
    });
    return text;
  }

  async getFriendsMessage(user: User) {
    // 读取最近联系人 -> 消息列表出发查找好友ID 并过滤相同
    const userIds = await this.messageModel.find({
      friendId: user.id,
    }).sort({ createTime: -1 }).distinct('userId').exec();
    const friendIds: number[] = Array.from(new Set(userIds.concat(await this.messageModel.find({
      userId: user.id,
    }).sort({ createTime: -1 }).distinct('friendId').exec())));

    if (friendIds.length == 0) return [];
    const waitFriends = friendIds.map(id => {
      return this.getMessage(user, {
        friendId: id,
        page: 1,
        limit: 1,
      }).then(res => res.find(v => v != null).toObject());
    });
    const [friends, friendsInfo] = await Promise.all([
      Promise.all(waitFriends),
      this.usersRepository.createQueryBuilder('user')
        .leftJoin(Friends, 'friend', 'friend.friendId = user.id')
        .where('user.id = :userId', { userId: user.id })
        .whereInIds(friendIds)
        .select([
          'user.id as id',
          'user.nickname as nickname',
          'user.username as username',
          'user.avatar as avatar',
          'user.signature as signature',
          'friend.remark as remark',
          'friend.status as status',
        ])
        .getRawMany(),
    ]);
    friendsInfo.forEach(friendInfo => {
      const index = friends.findIndex(v => v.friendId == friendInfo.id || v.userId == friendInfo.id);
      if (index != -1) friends[index]['user'] = friendInfo;
    });
    return friends.sort((a, b) => b.createTime > a.createTime ? 1 : -1);
  }
}
