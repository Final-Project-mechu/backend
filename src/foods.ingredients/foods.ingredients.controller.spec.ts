import { Test, TestingModule } from '@nestjs/testing';
import { FoodsIngredientsController } from './foods.ingredients.controller';

describe('FoodsIngredientsController', () => {
  let controller: FoodsIngredientsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsIngredientsController],
    }).compile();

    controller = module.get<FoodsIngredientsController>(FoodsIngredientsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
