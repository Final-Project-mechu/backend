import { Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { multerOptionsFactory } from 'src/multer/multer.options.factory';
import { S3Service } from 'src/aws/s3.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerOptionsFactory,
      inject: [ConfigService],
    }),
  ],
  controllers: [UploadsController],
  providers: [S3Service],
})
export class UploadsModule {}
