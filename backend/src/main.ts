import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Internet Banking API')
    .setDescription('The Internet Banking API description')
    .setVersion('1.0')
    .addTag('account', 'Endpoints for managing bank accounts')
    .addTag('employee', 'Endpoints for managing employees')
    .addTag('customer', 'Endpoints for managing customers')
    .addTag('debt-reminder', 'Endpoints for managing debt reminders. 2 status: Pending, Completed')
    .addTag('recipient', 'Endpoints for managing recipients')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
  await app.listen(3000);
}
bootstrap();
