import {
  Controller,
  Post,
  Body,
  Get,
  Delete,
  Req,
  BadRequestException,
} from '@nestjs/common';
import { FriendsService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { User } from 'src/entity/user.entity';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      sender: string;
    };
  };
}

@Controller('friends')
export class FriendController {
  constructor(private friendService: FriendsService) {}

  @Get('/find-friend')
  async findFriend(@Body() data: CreateFriendDto) {
    const allFriend = await this.friendService.getFriendInfo(
      data.receiverEmail,
    );
    return allFriend;
  }

  @Post('send-request')
  async sendFriendRequest(
    @Body() data: CreateFriendDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    try {
      await this.friendService.requestFriend(
        auth.id,
        data.sender,
        data.receiverEmail,
        data.status,
      );
      console.log('확인용', data.sender);
      return { message: '친구 요청을 성공적으로 보냈습니다.' };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  @Post('accept-friend')
  async acceptFriend(
    @Body() data: UpdateFriendDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;

    await this.friendService.acceptFriend(
      auth.id,
      data.sender,
      data.receiverEmail,
      data.status,
    );

    return { message: '친구 요청을 수락했습니다.' };
  }

  @Post('reject-friend')
  async rejectFriend(@Body() data: UpdateFriendDto) {
    await this.friendService.rejectFriend(data.receiverEmail, data.status);

    return { message: '친구 요청을 거절했습니다.' };
  }

  @Delete('delete-friend')
  async deleteFriend(@Body() data: UpdateFriendDto) {
    await this.friendService.deleteFriend(data.receiverEmail, data.status);
    return { message: '친구 삭제가 완료되었습니다.' };
  }
}
