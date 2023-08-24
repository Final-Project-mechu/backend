import { Body, Controller, Post } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { CreateFeedDto } from './dto/create.feeds.dto';

@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Post('/')
  createFeed(@Body() data: CreateFeedDto, favorite_Id: number) {
    // const user = request.locals.user
    return this.feedsService.createFeed(data.title, data.description);
  }
}
