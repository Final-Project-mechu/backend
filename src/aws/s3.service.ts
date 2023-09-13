import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'; // 여기 자동으로 안불러와짐
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import _ from 'lodash';
import sharp from 'sharp';

@Injectable()
export class S3Service {
  private readonly client: S3Client;
  private readonly region: string = this.configService.get<string>('REGION');
  private readonly bucket: string =
    this.configService.get<string>('BUCKET_NAME');
  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_KEY'),
      },
    });
  }

  async putObject(image: any) {
    const resizeImg = sharp(image.path);
    let { width, height } = await resizeImg.metadata();
    if (_.isUndefined(width)) {
      width = 1;
    }
    if (_.isUndefined(height)) {
      height = 1;
    }
    const maxWidth = 200;
    const maxHeight = 200;
    const ratio = Math.min(maxWidth / width, maxHeight / height);

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: image.filename,
        Body: await resizeImg
          .resize(Math.round(width * ratio), Math.round(height * ratio))
          .toBuffer(),
        ContentType: image.mimetype,
      }),
    );
    return `https://${this.bucket}.s3.${this.region}.amazonaws.com/${image.filename}`;
  }
}
