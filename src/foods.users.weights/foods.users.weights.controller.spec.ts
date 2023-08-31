import { Test, TestingModule } from '@nestjs/testing';
import { FoodsUsersWeightsController } from './foods.users.weights.controller';

describe('FoodsUsersWeightsController', () => {
  let controller: FoodsUsersWeightsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsUsersWeightsController],
    }).compile();

    controller = module.get<FoodsUsersWeightsController>(FoodsUsersWeightsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
