import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorate } from 'src/entity/favorate.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Favorate])],
  controllers: [FavoritesController],
  providers: [FavoritesService],
})
export class FavoritesModule {}
