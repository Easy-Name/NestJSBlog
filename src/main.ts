import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //dotenv.config();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, //the DTOs that are used to receive requests are received as objects and transformed to a real instance of that DTO In the application
      /*transformOptions: {
        enableImplicitConversion: true, //implicitly convert types
      },*/
    }),
  );

  const config = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('www.mocktof.co.uk')
    .setLicense('MIT License', 'https://www.mit.edu/~amini/LICENSE.md')
    .addServer('http://localhost:3000/')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  //enable cors
  app.enableCors();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
