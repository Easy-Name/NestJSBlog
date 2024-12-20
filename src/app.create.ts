import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import * as dotenv from 'dotenv';

export function appCreate(app: INestApplication): void {
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

  const swaggerConfig = new DocumentBuilder()
    .setVersion('1.0')
    .setTitle('NestJS Masterclass - Blog app API')
    .setDescription('Use the base API URL as http://localhost:3000')
    .setTermsOfService('www.mocktof.co.uk')
    .setLicense('MIT License', 'https://www.mit.edu/~amini/LICENSE.md')
    .addServer('http://localhost:3000/')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  //enable cors
  app.enableCors();

}
