import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req, UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuards } from '../auth/auth.guards';
import { MessageService } from './message.service';
import { GetMessageDto, IFileType, SendImageMessageDto, SendTextMessageDto, SendVoiceMessageDto } from './message.dto';
import { result } from '../utils/basis.util';
import { FileInterceptor } from '@nestjs/platform-express';

@ApiTags('消息')
@UseGuards(AuthGuards)
@ApiBearerAuth()
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {
  }

  @ApiOperation({ summary: '读取消息记录' })
  @Get()
  async getMessage(@Req() req, @Query() param: GetMessageDto) {
    return await this.messageService.getMessage(req.user, param);
  }

  @ApiOperation({ summary: "读取最近联系人" })
  @Get('friends')
  async getFriendsMessage(@Req() req) {
    return await this.messageService.getFriendsMessage(req.user);
  }

  @ApiOperation({ summary: '发送文本消息' })
  @Post('text')
  async sendTextMessage(@Req() req, @Body() body: SendTextMessageDto) {
    return await this.messageService.sendTextMessage(req.user, body);
  }

  @ApiOperation({ summary: '发送图片消息' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SendImageMessageDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('image', {
    fileFilter(req, file, callback) {
      if (file.mimetype.match(/image\/*/) == null) {
        callback(new BadRequestException('图片类型错误'), false);
      }
      callback(null, true);
    }
  }))
  @Post('image')
  async sendImageMessage(@UploadedFile() file: IFileType) {
    return file;
  }

  @ApiOperation({ summary: '发送语音消息' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: SendVoiceMessageDto,
    required: true,
  })
  @UseInterceptors(FileInterceptor('voice', {
    fileFilter(req, file, callback) {
      if (file.mimetype.match(/audio\/*/) == null) {
        callback(new BadRequestException('音频类型错误'), false);
      }
      callback(null, true);
    }
  }))
  @Post('voice')
  async sendVoiceMessage(@UploadedFile() file: IFileType) {
    const { buffer, ...param } = file;
    return param;
  }
}
