import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import * as _ from 'lodash';

@Injectable()
export class FileSizeValidationPipe implements PipeTransform {
  constructor(private readonly mode: string) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const imageType = ['IMAGE/PNG', 'IMAGE/JPEG', 'IMAGE/JPG'];

    if (_.isEmpty(value)) {
      if (this.mode === 'create') {
        throw new BadRequestException('이미지 파일을 입력하셔야 합니다.');
      }
    } else if (this.mode === 'modify') {
      return value;
    }

    if (value.length > 1) {
      throw new BadRequestException('이미지 파일은 1장만 업로드 가능합니다.');
    }

    if (!imageType.includes(value.mimetype.toUpperCase())) {
      throw new BadRequestException('이미지 파일만 업로드 할 수 있습니다.');
    }
    return value;
  }
}
