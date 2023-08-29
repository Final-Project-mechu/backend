import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import dotenv = require('dotenv');
import session from 'express-session';
import passport from 'passport';
import cookieParser = require('cookie-parser');
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  await app.listen(3000);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(
    session({
      secret: 'asiodasjoddjdoasddasoidjasiodasdjaiodd',
      saveUninitialized: false,
      resave: false,
      cookie: {
        maxAge: 60000,
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors();
  app.use(passport.initialize());
  app.use(passport.session());
  app.useStaticAssets('public');
  const config = new DocumentBuilder()
    .setTitle('Cats example')
    .setDescription('The cats API description')
    .setVersion('1.0')
    .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}
bootstrap();
