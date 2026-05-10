import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 1 }));
  app.useGlobalPipes(new ValidationPipe());
  const port = process.env.PORT ?? 4000;
  await app.listen(port);
  console.log(`🚀 Server is running on http://localhost:${port}/graphql`);
}
bootstrap();
