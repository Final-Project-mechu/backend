import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create.feeds.dto';
import { UpdateFeedDto } from './dto/update.feeds.dto';
import { Request } from 'express';
import { ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

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

  @ApiOperation({ summary: '찜한 상점과 함께 피드 생성' })
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  createFavoriteFeed(
    @Body()
    favorite_ids: string | number,
    @Body() data: CreateFeedDto,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    return this.feedsService.createFavoriteFeed(
      auth.id,
      favorite_ids,
      data.title,
      data.description,
      file,
    );
  }

  @ApiOperation({ summary: '피드 생성' })
  @Post('/common')
  @UseInterceptors(FileInterceptor('file'))
  createFeed(
    @Body() data: CreateFeedDto,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    return this.feedsService.createFeed(
      auth.id,
      data.title,
      data.description,
      file,
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

  @ApiOperation({ summary: '피드 수정(제목, 내용만 수정가능)' })
  @Patch('/:id')
  updateFeed(
    @Param('id') id: number,
    @Body() data: UpdateFeedDto,
    @UploadedFile()
    file: Express.Multer.File,
    @Req() request: RequestWithLocals,
  ) {
    const auth = request.locals.user;
    return this.feedsService.updateFeed(
      id,
      auth.id,
      data.title,
      data.description,
      file,
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
