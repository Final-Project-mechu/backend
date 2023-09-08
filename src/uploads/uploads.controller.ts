import {
  Controller,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';
import { FileSizeValidationPipe } from './dto/uploads.create.dto';
import { S3Module } from 'nestjs-s3';
import { Express } from 'express';

@Controller('uploads')
export class UploadsController {
  constructor(private readonly configService: ConfigService) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file);
    AWS.config.update({
      region: 'ap-northeast-2',
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });

    try {
      const upload = await new AWS.S3()
        .upload({
          Bucket: 'final-bucket-ksr',
          Key: file.originalname,
          Body: file.buffer,
        })
        .promise();
      console.log(file);
      console.log(upload);
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
}
