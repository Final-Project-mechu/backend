import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create.feeds.dto';
import { UpdateFeedDto } from './dto/update.feeds.dto';
import { Request } from 'express';

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post('/')
  createFeed(@Body() data: any, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.createFeed(
      auth.id,
      data.favorite_id,
      data.title,
      data.description,
    );
  }

  @Get()
  getFeeds() {
    // 전체 피드 보기
    return this.feedsService.getFeeds();
  }

  @Get('/:id')
  getFeed(@Param('id') id: number) {
    return this.feedsService.getFeed(id);
  }

  @Patch('/:id')
  updateFeed(
    @Param('id') id: number,
    @Body() data: UpdateFeedDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    return this.feedsService.updateFeed(
      id,
      auth.id,
      data.title,
      data.description,
    );
  }

  @Delete('/:id')
  deleteFeed(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.deleteFeed(id, auth.id);
  }

  @Get('/:id/like')
  getFeedLikes(@Param('id') id: number) {
    return this.feedsService.getFeedLikes(id);
  }

  @Post('/:id/like')
  feedLike(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.feedLike(id, auth.id);
  }

  @Delete('/:id/like')
  feedLikeCancel(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.feedLikeCancel(id, auth.id);
  }
}
