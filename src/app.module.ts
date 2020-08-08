import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { RedisModule } from 'nestjs-redis';
import { CacheModule } from './cache/cache.module';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { FriendsModule } from './friends/friends.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageModule } from './message/message.module';
import { AlipayModule } from './alipay/alipay.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGODB')
      }),
      inject: [ConfigService],
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        host: config.get('REDIS_HOST'),
        port: config.get('REDIS_PORT'),
        name: config.get('REDIS_NAME'),
      })
    }),
    TypeOrmModule.forRoot(),
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
