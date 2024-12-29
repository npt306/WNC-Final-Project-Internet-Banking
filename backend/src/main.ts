import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  // app.useGlobalPipes(new ValidationPipe({
  //   whitelist: true,
  //   forbidNonWhitelisted: true
  // }));

  app.setGlobalPrefix('api', { exclude: ['/'] });

  //config cors
 app.enableCors({
   origin: '*',
   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
   preflightContinue: false,
   credentials: true,
   allowedHeaders: [
     'Content-Type',
     'Authorization',
     'X-Custom-Header', 
   ],
 });

  const config = new DocumentBuilder()
    .setTitle('Internet Banking API')
    .setDescription('The Internet Banking API description')
    .setVersion('1.0')
    .addTag('account', 'Endpoints for managing bank accounts')
    .addTag('employee', 'Endpoints for managing employees')
    .addTag('customer', 'Endpoints for managing customers')
    .addTag(
      'debt-reminder',
      'Endpoints for managing debt reminders. 2 status: Pending, Completed',
    )
    .addTag('recipient', 'Endpoints for managing recipients')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(port);
}
bootstrap();
