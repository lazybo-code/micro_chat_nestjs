import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  AuthPutProfileDto,
  AuthUserLoginDto,
  AuthUserRegisterDto,
} from './auth.dto';
import { AuthGuards } from './auth.guards';
import { result } from '../utils/basis.util';

@ApiTags('认证')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 201, description: '{ "access_token": "..." }' })
  @ApiResponse({
    status: 401,
    description:
      '{ "statusCode": 401, "message": "账号或者密码不正确", "error": "Unauthorized" }',
  })
  @Post('user/login')
  async userLogin(@Body() param: AuthUserLoginDto) {
    const { password, ...other } = await this.authService.verification(
      param.username,
      param.password,
    );
    return this.authService.login({
      type: param.type,
      ...other,
    });
  }

  @ApiOperation({ summary: '用户注册' })
  @Post('user/register')
  async userRegister(@Body() param: AuthUserRegisterDto) {
    await this.authService.createUser(param);
    return result();
  }

  @UseGuards(AuthGuards)
  @ApiOperation({ summary: '获取用户资料' })
  @ApiBearerAuth()
  @Get('user/profile')
  async userProfile(@Req() req) {
    return req.user;
  }

  @UseGuards(AuthGuards)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新用户资料' })
  @Put('user/profile')
  async putUserProfile(@Body() param: AuthPutProfileDto, @Req() req) {
    const status = await this.authService.putProfile(req.user.id, param);
    if (status.raw.changedRows > 0) {
      return result(true, '更新成功');
    }
    return result(false, '更新失败');
  }
}
