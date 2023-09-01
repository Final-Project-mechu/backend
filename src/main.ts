import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import dotenv = require('dotenv');
import cookieParser = require('cookie-parser');
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
dotenv.config();
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const config = new DocumentBuilder()
    .setTitle('오늘뭐먹지?투게더 잇')
    .setDescription('메뉴추천 API')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    credentials: true,
  });
  app.useStaticAssets(join(__dirname, '../', 'public'));
  await app.listen(3000);
}
bootstrap();
