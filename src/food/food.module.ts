import { Module } from '@nestjs/common';
import { Food } from 'src/entity/food.entity';
import { FoodService } from './food.service';
import { FoodController } from './food.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { JwtConfigService } from 'src/config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3Service } from 'src/aws/s3.service';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/multer/multer.options.factory';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, Food]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ],
  providers: [FoodService, S3Service],
  controllers: [FoodController],
})
export class FoodModule {}
