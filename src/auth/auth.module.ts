import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TokenUtil } from '../utils/token.util';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';

@Module({
  imports: [TokenUtil, TypeOrmModule.forFeature([User])],
  providers: [AuthService, TokenUtil],
  controllers: [AuthController],
})
export class AuthModule {}
