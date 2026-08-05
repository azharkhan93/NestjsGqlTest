import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { setupCors } from '@common/application/helpers';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    helmet({ contentSecurityPolicy: false, crossOriginEmbedderPolicy: false }),
  );
  app.use(cookieParser());
  app.use(graphqlUploadExpress({ maxFileSize: 5000000, maxFiles: 1 }));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  setupCors(app);
  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');
  new Logger('Bootstrap').log(`Server running on port ${port}`);
}
bootstrap();
