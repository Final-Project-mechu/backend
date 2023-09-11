import { Test, TestingModule } from '@nestjs/testing';
import { DislikesIngredientsService } from './dislikes_ingredients.service';

describe('DislikesIngredientsService', () => {
  let service: DislikesIngredientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DislikesIngredientsService],
    }).compile();

    service = module.get<DislikesIngredientsService>(DislikesIngredientsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
