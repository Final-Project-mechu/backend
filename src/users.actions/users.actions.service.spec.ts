import { Test, TestingModule } from '@nestjs/testing';
import { UsersActionsService } from './users.actions.service';

describe('UsersActionsService', () => {
  let service: UsersActionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersActionsService],
    }).compile();

    service = module.get<UsersActionsService>(UsersActionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
