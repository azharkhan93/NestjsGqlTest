import { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication): void => {
  app.enableCors({
    origin: [
      'http://localhost:8080',
      'http://localhost:3000',
      'http://localhost:3001',
      'https://studio.apollographql.com',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Accept, Authorization, Apollo-Require-Preflight, x-apollo-operation-name',
  });
};
