import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserModule } from './user/user.module';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as session from 'express-session';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { allowedOrigins } from './config/allowedOrigins';
import { json, urlencoded } from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const options = {
    origin: ['http://localhost:5173', '/chebaani.com$/'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };
  //app.use(cors(options))
  app.enableCors(options);
  app.use(cookieParser());

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  app.use(
    session({
      secret: process.env.SECRET,
      resave: false,
      saveUninitialized: false,
    }),
  );

  app.use(
    helmet({
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    }),
  );
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
