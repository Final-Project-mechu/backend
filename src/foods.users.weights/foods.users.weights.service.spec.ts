import { Test, TestingModule } from '@nestjs/testing';
import { FoodsUsersWeightsService } from './foods.users.weights.service';

describe('FoodsUsersWeightsService', () => {
  let service: FoodsUsersWeightsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodsUsersWeightsService],
    }).compile();

    service = module.get<FoodsUsersWeightsService>(FoodsUsersWeightsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
