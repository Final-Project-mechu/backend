import {
  Injectable,
  UploadedFile,
  UnauthorizedException,
} from '@nestjs/common';
import { S3 } from 'aws-sdk';
import * as multer from 'multer';
import * as multerS3 from 'multer-s3';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/entity/user.entity';
import { FoodImags } from 'src/entity/food.img.entity';
import { Repository } from 'typeorm';
import { createFoodsImagsDto } from './dto/createFoodsImags.dto';
import { url } from 'inspector';

@Injectable()
export class FoodsImagsService {
  private s3 = new S3();
  constructor(
    @InjectRepository(FoodImags)
    private foodimagsReository: Repository<FoodImags>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  //관리자 판별 메소드
  async confirmAdmin(user_id) {
    console.log(user_id);
    const confirmAdmin = await this.userRepository.findOne({
      where: { id: user_id },
      select: ['is_admin'],
    });
    return confirmAdmin;
  }

  async createFoodsImgs(
    file: Express.Multer.File,
    user_id: number,
    food_id: number,
  ) {
    console.log('ser', food_id);
    const { originalname, buffer } = file;
    const extension = path.extname(originalname);
    const filename = `${uuid()}${extension}`;


    const params = {
      Bucket: 'a5-imgfood-bucket',
      Key: filename,
      Body: file.buffer,
    };

    const checkAdmin = await this.confirmAdmin(user_id);
    if (checkAdmin.is_admin !== 1) {
      console.log('관리자가 아닙니다.');
      throw new UnauthorizedException('관리자가 아닙니다.');
    }


    // const s3Response = await this.s3.upload(params).promise();
    // const s3Response = await this.s3.putObject({
    //   Bucket: 'a5-imgfood-bucket',
    //   Key: filename,
    //   Body: file.buffer,
    //   ContentType: 'image/png'
    // }).promise();
  
    // return { message: '음식 생성 완료' };
    // const imageUrl = s3Response.Location;
    // const imageUrl = s3Response.Location;

    // const foodImage = new FoodImags();
    // foodImage.filename = filename;
    // foodImage.url = imageUrl;
    // foodImage.food_id = food_id;
    // return this.foodimagsReository.save(foodImage);
  }
}
