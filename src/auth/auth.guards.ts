import { CanActivate, ExecutionContext } from '@nestjs/common/interfaces';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { TokenUtil } from '../utils/token.util';

@Injectable()
export class AuthGuards implements CanActivate {
  constructor(private tokenUtil: TokenUtil) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const headers = req.headers;
    const authorization = headers['authorization'] || null;
    if (authorization == null) throw new UnauthorizedException('无操作权限');
    const userToken = authorization.split(' ')[1];
    if (userToken == null) throw new UnauthorizedException('无操作权限');
    const user = await this.tokenUtil.getUserByToken(userToken);
    if (user == null) throw new UnauthorizedException('过期的权限');
    req.user = user;
    return true;
  }
}
