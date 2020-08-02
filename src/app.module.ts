import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { RedisModule } from 'nestjs-redis';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { FriendsModule } from './friends/friends.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entitys/user.entity';
import { Friends } from './entitys/friends.entity';
import { MessageModule } from './message/message.module';
import { AlipayModule } from './alipay/alipay.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/chat-server'),
    TypeOrmModule.forRoot({
      entities: [
        User,
        Friends,
      ],
    }),
    RedisModule.register({
      host: '127.0.0.1',
      port: 6379,
      name: 'chat-service',
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    CacheModule,
    AuthModule,
    EventsModule,
    FriendsModule,
    MessageModule,
    AlipayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
