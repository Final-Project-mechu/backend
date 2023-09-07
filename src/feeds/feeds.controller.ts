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
import { ApiOperation } from '@nestjs/swagger';

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

  @ApiOperation({ summary: '피드 생성' })
  @Post('/')
  createFeed(
    @Body()
    data: { favorite_ids: number[] },
    @Body() createFeedDto: CreateFeedDto,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    return this.feedsService.createFeed(
      auth.id,
      data.favorite_ids,
      createFeedDto.title,
      createFeedDto.description,
    );
  }

  @ApiOperation({ summary: '피드 전체 조회' })
  @Get()
  getFeeds() {
    return this.feedsService.getFeeds();
  }

  @ApiOperation({ summary: '피드 상세 조회' })
  @Get('/:id')
  getFeed(@Param('id') id: number) {
    return this.feedsService.getFeed(id);
  }

  @ApiOperation({ summary: '피드 수정' })
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

  @ApiOperation({ summary: '피드 삭제' })
  @Delete('/:id')
  deleteFeed(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.deleteFeed(id, auth.id);
  }

  @ApiOperation({ summary: '피드 좋아요 수 조회' })
  @Get('/:id/like')
  getFeedLikes(@Param('id') id: number) {
    return this.feedsService.getFeedLikes(id);
  }

  @ApiOperation({ summary: '피드 좋아요' })
  @Post('/:id/like')
  feedLike(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.feedLike(id, auth.id);
  }

  @ApiOperation({ summary: '피드 좋아요 취소' })
  @Delete('/:id/like')
  feedLikeCancel(@Param('id') id: number, @Req() request: RequestWithLocals) {
    const auth = request.locals.user;
    return this.feedsService.feedLikeCancel(id, auth.id);
  }
}
