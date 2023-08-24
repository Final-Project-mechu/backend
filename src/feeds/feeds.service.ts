import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Feed } from 'src/entity/feed.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FeedsService {
  constructor(
    @InjectRepository(Feed) private readonly feedRepository: Repository<Feed>,
  ) {}
  createFeed(title: string, description: string) {
    return this.feedRepository.insert({ title, description });
  }
}
