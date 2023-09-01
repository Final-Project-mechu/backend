import { Test, TestingModule } from '@nestjs/testing';
import { UsersActionsController } from './users.actions.controller';

describe('UsersActionsController', () => {
  let controller: UsersActionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersActionsController],
    }).compile();

    controller = module.get<UsersActionsController>(UsersActionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
