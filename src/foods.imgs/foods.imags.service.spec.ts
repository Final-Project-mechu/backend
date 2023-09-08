import { Test, TestingModule } from '@nestjs/testing';
import { FoodsImagsService } from './foods.imags.service';

describe('FoodsImagsService', () => {
  let service: FoodsImagsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FoodsImagsService],
    }).compile();

    service = module.get<FoodsImagsService>(FoodsImagsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
