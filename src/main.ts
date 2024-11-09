import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppDataSource } from './database/data-source';

async function bootstrap() {
  await AppDataSource.initialize();
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.APP_PORT) || 3000;

  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
