import { Test, TestingModule } from '@nestjs/testing';
import { FoodsImgsController } from './foods.imags.controller';

describe('FoodsImgsController', () => {
  let controller: FoodsImgsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsImgsController],
    }).compile();

    controller = module.get<FoodsImgsController>(FoodsImgsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
