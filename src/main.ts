import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { setupCors } from '@common/application/helpers';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 1 }));
  app.useGlobalPipes(new ValidationPipe());
  setupCors(app);
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}/graphql`);
}
bootstrap();
