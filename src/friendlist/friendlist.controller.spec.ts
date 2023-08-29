import { Test, TestingModule } from '@nestjs/testing';
import { FriendlistController } from './friendlist.controller';

describe('FriendlistController', () => {
  let controller: FriendlistController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendlistController],
    }).compile();

    controller = module.get<FriendlistController>(FriendlistController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
