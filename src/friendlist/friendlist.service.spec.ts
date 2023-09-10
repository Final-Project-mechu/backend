import { Test, TestingModule } from '@nestjs/testing';
import { FriendlistService } from './friendlist.service';

describe('FriendlistService', () => {
  let service: FriendlistService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FriendlistService],
    }).compile();

    service = module.get<FriendlistService>(FriendlistService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
