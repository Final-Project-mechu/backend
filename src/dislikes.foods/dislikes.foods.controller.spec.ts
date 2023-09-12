import { Test, TestingModule } from '@nestjs/testing';
import { DislikesFoodsController } from './dislikes_foods.controller';

describe('DislikesFoodsController', () => {
  let controller: DislikesFoodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikesFoodsController],
    }).compile();

    controller = module.get<DislikesFoodsController>(DislikesFoodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
