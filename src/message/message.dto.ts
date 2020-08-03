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

export class SendImageMessageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  image: IFileType;
}

export class SendVoiceMessageDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  voice: IFileType;
}

export interface IFileType {
  /** Field name specified in the form */
  fieldname: string;
  /** Name of the file on the user's computer */
  originalname: string;
  /** Encoding type of the file */
  encoding: string;
  /** Mime type of the file */
  mimetype: string;
  /** Size of the file in bytes */
  size: number;
  /** The folder to which the file has been saved (DiskStorage) */
  destination: string;
  /** The name of the file within the destination (DiskStorage) */
  filename: string;
  /** Location of the uploaded file (DiskStorage) */
  path: string;
  /** A Buffer of the entire file (MemoryStorage) */
  buffer: Buffer;
}
