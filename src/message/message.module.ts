import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TokenUtil } from '../utils/token.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { Friends } from '../entitys/friends.entity';
import { EventsGateway } from '../events/events.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { Message, MessageSchema } from '../schemas/message.schema';

@Module({
  imports: [
    TokenUtil,
    TypeOrmModule.forFeature([
      User,
      Friends,
    ]),
    MongooseModule.forFeature([{ name: Message.name, schema: MessageSchema }])
  ],
  controllers: [MessageController],
  providers: [MessageService, TokenUtil, EventsGateway],
})
export class MessageModule {}
