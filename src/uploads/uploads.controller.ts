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
import { S3Service } from 'src/aws/s3.service';

@Controller('uploads')
export class UploadsController {
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
  ) {}

  @Post('')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile()
    file: Express.Multer.File,
  ) {
    console.log(file);
    const image = await this.s3Service.putObject(file);
    return image;
  }
}
