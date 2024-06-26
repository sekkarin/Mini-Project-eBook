import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { corsOptions } from './utils/corsOptions';

const configService = new ConfigService();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['debug', 'error', 'log', 'verbose', 'warn'],
  });
  app.use(cookieParser());

  app.enableCors({ ...corsOptions });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  if (process.env.NODE_ENV == 'dev') {
    const config = new DocumentBuilder()
      .setTitle('api')
      .setDescription('API')
      .setVersion('1.0')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
  await app.listen(configService.get<number>('PORT') || process.env.PORT);
}
bootstrap();
