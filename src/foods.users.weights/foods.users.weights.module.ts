import { Module } from '@nestjs/common';
import { FoodsUsersWeightsController } from './foods.users.weights.controller';
import { FoodsUsersWeightsService } from './foods.users.weights.service';

@Module({
  controllers: [FoodsUsersWeightsController],
  providers: [FoodsUsersWeightsService]
})
export class FoodsUsersWeightsModule {}
