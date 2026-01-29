import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // This turns on the "firewall" for your DTOs
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strips out properties that aren't defined in the DTO
    forbidNonWhitelisted: true, // Rejects requests with extra, undefined properties
    transform: true, // Automatically converts network strings to DTO types (e.g., string to Date)
  }));

  // Standard industry practice: Use environment variable or default to 3000
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();