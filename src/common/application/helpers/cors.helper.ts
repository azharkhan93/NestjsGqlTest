import { INestApplication } from '@nestjs/common';

export const setupCors = (app: INestApplication): void => {
  const allowedOriginsEnv = process.env.CORS_ALLOWED_ORIGINS
    ? process.env.CORS_ALLOWED_ORIGINS.split(',').map((o) => o.trim())
    : [];

  const defaultAllowedOrigins = [
    'http://localhost:8080',
    'http://localhost:3000',
    'http://localhost:3001',
    'http://localhost:8081',
    'http://localhost:19006',
    'https://studio.apollographql.com',
    'https://sandbox.apollo.dev',
    'https://27.100.38.251.sslip.io',
    ...allowedOriginsEnv,
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow mobile apps (no Origin header), Postman, or whitelisted origins
      if (
        !origin ||
        defaultAllowedOrigins.includes(origin) ||
        defaultAllowedOrigins.includes('*')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Allow production origins for API accessibility
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Accept, Authorization, Apollo-Require-Preflight, x-apollo-operation-name, apollo-require-preflight',
  });
};
