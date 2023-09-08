import {
  Controller,
  Body,
  Delete,
  Get,
  Post,
  Req,
  Res,
  Param,
  BadRequestException,
  Patch,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FoodsImagsService } from './foods.imags.service';
import { createFoodsImagsDto } from './dto/createFoodsImags.dto';
import { Request, Response, response } from 'express';
import { request } from 'http';
import { FileInterceptor } from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { Express} from 'express'

interface RequestWithLocals extends Request {
  locals: {
    user: {
      id: number;
      nick_name: string;
    };
  };
}

@Controller('foodimage')
export class FoodsImgsController {
  constructor(
    private readonly foodsImagsService: FoodsImagsService,
    private readonly configService: ConfigService,
  ) {}

  //@Req() request: RequestWithLocals 받는 메소드
  async reqId(@Req() request: RequestWithLocals) {
    const userId = request.locals.user;
    return userId.id;
  }

  //사진 생성
  @Post('/')
  @UseInterceptors(FileInterceptor('file'))
  async createFoodImage(
    @Body() data: createFoodsImagsDto,
    @Req() request: RequestWithLocals,
    @UploadedFile() file: Express.Multer.File,
    // @UploadedFile() file: Promise<createFoodsImagsDto>,
  ) {
    console.log('con', file);
    const user = request.locals.user;

    console.log('con', data.food_id);
    await this.foodsImagsService.createFoodsImgs(file, user.id, data.food_id);
    return { message: '음식 생성 완료' };
  }



  @Post('/test')
  @UseInterceptors(FileInterceptor('file'))
  async upLoadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    AWS.config.update({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
    const upload = await new AWS.S3().upload({
        Bucket: 'final-bucket-ksr',
        Key: file.originalname,
        Body: file.buffer,
    })
    .promise();
    console.log(file);
    console.log(upload);
  }
}
