import { Test, TestingModule } from '@nestjs/testing';
import { LikesFoodsService } from './likes.foods.service';

describe('LikesFoodsService', () => {
  let service: LikesFoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LikesFoodsService],
    }).compile();

    service = module.get<LikesFoodsService>(LikesFoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
