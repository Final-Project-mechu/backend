import { Test, TestingModule } from '@nestjs/testing';
import { LikesFoodsController } from './likes.foods.controller';

describe('LikesFoodsController', () => {
  let controller: LikesFoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LikesFoodsController],
    }).compile();

    controller = module.get<LikesFoodsController>(LikesFoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
