import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger Configuration
  const config = new DocumentBuilder()
    .setTitle('Events Management API')
    .setDescription('Api for events management')
    .setVersion('1.0')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, documentFactory);

  app.use(
    '/uploads/contracts',
    express.static(join(__dirname, '..', 'uploads/contracts')),
  );
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableVersioning({ type: VersioningType.URI });
  app.setGlobalPrefix('api/v1');
  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
