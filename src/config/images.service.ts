// images.service.ts
// import { Injectable } from '@nestjs/common';
// import { S3 } from 'aws-sdk';
// import * as multer from 'multer';
// import * as multerS3 from 'multer-s3';
// import { v4 as uuid } from 'uuid';

// @Injectable()
// export class ImagesService {
//   private readonly s3: S3;

//   constructor() {
//     this.s3 = new S3();
//   }

//   async uploadImage(file: Express.Multer.File): Promise<string> {
//     const uploadParams = {
//       Bucket: 'a5-imgfood-bucket',
//       Key: `${uuid()}-${file.originalname}`,
//       Body: file.buffer,
//       ACL: 'public-read', // Optional: 설정에 따라 업로드된 파일을 공개 또는 비공개로 설정할 수 있습니다.
//     };

//     try {
//       const uploadResult = await this.s3.upload(uploadParams).promise();
//       return uploadResult.Location;
//     } catch (error) {
//       throw new Error(`S3 업로드 중 오류 발생: ${error.message}`);
//     }
//   }
// }