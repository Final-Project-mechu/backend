import { Module } from '@nestjs/common';
import { User } from "src/entity/user.entity";
import { JwtConfigService } from 'src/config/jwt.config.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Food } from "src/entity/food.entity";
import { FoodImags } from 'src/entity/food.img.entity';
import { MulterModule } from '@nestjs/platform-express';
import { FoodsImagsService } from './foods.imags.service';
import { FoodsImgsController } from './foods.imags.controller';


@Module({
    imports:[
        TypeOrmModule.forFeature([User, Food, FoodImags]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useClass: JwtConfigService,
            inject: [ConfigService],
          }),
          MulterModule.register({
            dest: './uploads', // 파일이 임시로 업로드될 디렉토리 경로
          }),
    ],
    providers:[FoodsImagsService],
    controllers:[FoodsImgsController],
})
export class FoodsImagsModule {}
