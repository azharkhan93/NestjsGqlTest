import { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication): void => {
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization, Apollo-Require-Preflight, x-apollo-operation-name',
  });
};
