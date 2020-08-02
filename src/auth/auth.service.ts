import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ICreateUserToken, TokenUtil } from '../utils/token.util';
import { AuthPutProfileDto, AuthUserRegisterDto } from './auth.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entitys/user.entity';
import { sha1 } from '../utils/basis.util';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenUtil: TokenUtil,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async verification(username: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      username,
      password: sha1(password),
    });
    if (user == null) throw new UnauthorizedException('账号或者密码不正确');
    return user;
  }

  async login(user: ICreateUserToken) {
    return { access_token: await this.tokenUtil.createUserToken(user) };
  }

  async createUser(body: AuthUserRegisterDto) {
    const user = await this.usersRepository.findOne({
      username: body.username,
    });
    if (user != null) throw new UnauthorizedException('注册账户已存在');
    return await this.usersRepository.insert({
      nickname: body.nickname,
      username: body.username,
      password: sha1(body.password),
    });
  }

  async putProfile(id: number, body: AuthPutProfileDto) {
    const user = await this.usersRepository.findOne({ id });
    if (user == null) throw new BadRequestException('用户不存在');
    const update: AuthPutProfileDto = {};
    if (body.avatar != null && body.avatar.trim().length > 0) {
      update.avatar = body.avatar;
    }
    if (body.nickname != null && body.nickname.trim().length > 0) {
      update.nickname = body.nickname;
    }
    if (body.signature != null && body.signature.trim().length > 0) {
      update.signature = body.signature;
    }
    return await this.usersRepository.update(id, update);
  }
}
