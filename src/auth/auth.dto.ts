import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { ITokenType } from '../utils/token.util';

export class AuthUserLoginDto {
  @ApiProperty({ title: '账号', default: '123', type: String })
  @IsString({ message: '账号不能空' })
  username: string;
  @ApiProperty({ title: '密码', default: '123', type: String })
  @IsString({ message: '密码不能空' })
  password: string;
  @ApiProperty({ title: '登录类型', enum: ['app', 'web', 'pc'] })
  @IsEnum(['app', 'web', 'pc'], { message: '登录类型错误' })
  type: ITokenType;
}

export class AuthUserRegisterDto {
  @ApiProperty({ title: '昵称', default: '123', type: String })
  @IsString({ message: '昵称不能空' })
  nickname: string;
  @ApiProperty({ title: '账号', default: '123', type: String })
  @IsString({ message: '账号不能空' })
  username: string;
  @ApiProperty({ title: '密码', default: '123', type: String })
  @IsString({ message: '密码不能空' })
  password: string;
}

export class AuthPutProfileDto {
  @ApiProperty({ title: '昵称', default: '123', type: String })
  @IsString({ message: '昵称只能是文本' })
  @IsOptional()
  nickname?: string;
  @ApiProperty({ title: '头像', default: '123', type: String })
  @IsString({ message: '头像只能是文本' })
  @IsUrl(undefined, { message: '头像地址错误' })
  @IsOptional()
  avatar?: string;
  @ApiProperty({ title: '个性签名', default: '123', type: String })
  @IsString({ message: '个性签名只能是文本' })
  @IsOptional()
  signature?: string;
}
