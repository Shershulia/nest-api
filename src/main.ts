import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.useGlobalPipes(new ValidationPipe({
    //only defined properties in the DTO will be allowed
    whitelist: true,
  })).listen(3333);
}
bootstrap();
