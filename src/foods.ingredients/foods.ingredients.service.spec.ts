import { Test, TestingModule } from '@nestjs/testing';
import { FoodsIngredientsService } from './foods.ingredients.service';

describe('FoodsIngredientsService', () => {
  let service: FoodsIngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodsIngredientsService],
    }).compile();

    service = module.get<FoodsIngredientsService>(FoodsIngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
