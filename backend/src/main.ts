import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS so the Next.js frontend (port 3000) can call this API
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  // Enable class-validator globally — DTOs are validated automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strip unknown properties
      forbidNonWhitelisted: true, // Throw on unknown properties
      transform: true, // Auto-transform payloads to DTO instances
    }),
  );

  await app.listen(4000);
  console.log('🚀 EzeQ NestJS backend running on http://localhost:4000');
}
bootstrap();
