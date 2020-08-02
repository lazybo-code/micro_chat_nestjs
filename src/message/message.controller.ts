import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuards } from '../auth/auth.guards';
import { MessageService } from './message.service';
import { GetMessageDto, SendTextMessageDto } from './message.dto';
import { result } from '../utils/basis.util';

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
  @Post('image')
  async sendImageMessage() {
  }

  @ApiOperation({ summary: '发送语音消息' })
  @Post('voice')
  async sendVoiceMessage() {
  }
}
