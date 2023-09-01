import { Test, TestingModule } from '@nestjs/testing';
import { DislikesIngredientsController } from './dislikes.ingredients.controller';

describe('DislikesIngredientsController', () => {
  let controller: DislikesIngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DislikesIngredientsController],
    }).compile();

    controller = module.get<DislikesIngredientsController>(
      DislikesIngredientsController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
