import { ApiProperty } from '@nestjs/swagger';
import { IsNumberString, IsString } from 'class-validator';

export class GetMessageDto {
  @ApiProperty({ title: '好友ID', required: true })
  @IsNumberString(undefined, { message: '好友ID类型错误' })
  friendId: number;

  @ApiProperty({ title: '页数', default: 1, type: Number })
  @IsNumberString(undefined, { message: "页数格式错误" })
  page: number;

  @ApiProperty({ title: '条数', default: 30, type: Number })
  @IsNumberString(undefined, { message: "条数格式错误" })
  limit: number;
}

export class SendTextMessageDto {
  @ApiProperty({ title: '好友ID', required: true })
  @IsNumberString(undefined, { message: '好友ID类型错误' })
  friendId: number;

  @ApiProperty({ title: "消息", required: true })
  @IsString({ message: "消息不能空" })
  text: string;
}
