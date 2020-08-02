import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumberString, IsOptional, IsString } from 'class-validator';

export class AddFriendDto {
  @ApiProperty({ title: '好友ID', required: true })
  @IsNumberString(undefined, { message: '好友ID类型错误' })
  friendId: number;

  @ApiProperty({ title: '添加说明', required: true })
  @IsString({ message: "说明类型错误" })
  description: string;

  @ApiProperty({ title: '好友备注', required: false })
  @IsString({ message: '备注类型错误' })
  @IsOptional()
  remark?: string;
}

export class PutStatusFriendDto {
  @ApiProperty({ title: '好友ID', required: true })
  @IsNumberString(undefined, { message: '好友ID类型错误' })
  friendId: number;

  @ApiProperty({
    title: '同意或者拒绝',
    required: true,
    enum: ['agree', 'refusal'],
  })
  @IsEnum(['agree', 'refusal'])
  status: 'agree' | 'refusal';

  @ApiProperty({ title: '拒绝说明', required: false })
  @IsString({ message: '拒绝说明类型错误' })
  @IsOptional()
  refusal?: string;
}

export class DeleteFriendDto {
  @ApiProperty({ title: '好友ID', required: true })
  @IsNumberString(undefined, { message: '好友ID类型错误' })
  friendId: number;
}
