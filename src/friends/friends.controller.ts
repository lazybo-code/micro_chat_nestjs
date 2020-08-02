import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put, Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuards } from '../auth/auth.guards';
import { FriendsService } from './friends.service';
import { result } from '../utils/basis.util';
import {
  AddFriendDto,
  DeleteFriendDto,
  PutStatusFriendDto,
} from './friends.dto';

@UseGuards(AuthGuards)
@ApiBearerAuth()
@ApiTags('好友')
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @ApiOperation({ summary: '获取好友列表' })
  @Get()
  async getFriends(@Req() req) {
    return await this.friendsService.getFriends(req.user.id);
  }

  @ApiOperation({ summary: '添加好友' })
  @Post()
  async addFriend(@Req() req, @Body() body: AddFriendDto) {
    await this.friendsService.addFriend(
      req.user.id,
      body.friendId,
      body.description,
      body.remark,
    );
    return result();
  }

  @ApiOperation({ summary: '获取申请列表' })
  @Get('apply')
  async getApplyFriends(@Req() req) {
    return await this.friendsService.getApplyFriends(req.user.id);
  }

  @ApiOperation({ summary: '更改申请状态' })
  @Put('status')
  async putStatusFriend(@Req() req, @Body() body: PutStatusFriendDto) {
    await this.friendsService.putStatusFriend(req.user.id, body);
    return result();
  }

  @ApiOperation({ summary: "搜索好友" })
  @Get('/query')
  async queryFriends(@Req() req, @Query('query') query: string) {
    return await this.friendsService.queryFriends(req.user.id, query);
  }

  @ApiOperation({ summary: '加入黑名单' })
  @Post('black')
  async blackFriend() {}

  @ApiOperation({ summary: '删除好友' })
  @Delete()
  async deleteFriend(@Req() req, @Body() body: DeleteFriendDto) {
    return await this.friendsService.deleteFriend(req.user.id, body.friendId);
  }
}
