import { Module } from '@nestjs/common';
import { FriendlistService } from './friendlist.service';
import { FriendlistController } from './friendlist.controller';

@Module({
  providers: [FriendlistService],
  controllers: [FriendlistController]
})
export class FriendlistModule {}
