import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { TokenUtil } from '../utils/token.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { Friends } from '../entitys/friends.entity';
import { EventsGateway } from '../events/events.gateway';

@Module({
  imports: [TokenUtil, TypeOrmModule.forFeature([User, Friends])],
  controllers: [FriendsController],
  providers: [FriendsService, TokenUtil, EventsGateway],
})
export class FriendsModule {}
