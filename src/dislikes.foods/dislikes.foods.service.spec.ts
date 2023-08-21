import { Test, TestingModule } from '@nestjs/testing';
import { DislikesFoodsService } from './dislikes_foods.service';

describe('DislikesFoodsService', () => {
  let service: DislikesFoodsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DislikesFoodsService],
    }).compile();

    service = module.get<DislikesFoodsService>(DislikesFoodsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
