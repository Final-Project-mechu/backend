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
import { request } from 'express';

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
  createFeed(@Body() data, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.createFeed(
      auth.id,
      data.favorite_id,
      data.title,
      data.description,
    );
  }

  @Get('/')
  getFeeds() {
    // 전체 피드 보기
    return this.feedsService.getFeeds();
  }

  @Get('/:feed_id')
  getFeed(@Param() feed_id: number) {
    // 피드 상세 보기
    return this.feedsService.getFeed(feed_id);
  }

  @Patch('/:id')
  updateFeed(@Param() id: number, @Body() data: UpdateFeedDto) {
    return this.feedsService.updateFeed(id, data.title, data.description);
  }

  @Delete('/:id')
  deleteFeed(@Param() id: number) {
    return this.feedsService.deleteFeed(id);
  }

  @Get('/:id/like')
  getFeedLikes(@Param() id: number) {
    return this.feedsService.getFeedLikes(id);
  }

  @Post('/:id/like')
  feedLike(@Param() id: number) {
    return this.feedsService.feedLike(id);
  }

  @Delete('/:id/like')
  feedLikeCancel(@Param() id: number) {
    return this.feedsService.feedLikeCancel(id);
  }
}
