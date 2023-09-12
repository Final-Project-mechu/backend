import { Module } from '@nestjs/common';
import { DislikesIngredientsService } from './dislikes.ingredients.service';
import { DislikesIngredientsController } from './dislikes.ingredients.controller';

@Module({
  providers: [DislikesIngredientsService],
  controllers: [DislikesIngredientsController],
})
export class DislikesIngredientsModule {}
