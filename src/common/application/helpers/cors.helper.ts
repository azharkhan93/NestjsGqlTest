import { INestApplication, Logger } from '@nestjs/common';

const DEFAULT_ORIGINS = new Set([
  'http://localhost:8080',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:8081',
  'http://localhost:19006',
  'https://27.100.38.251.sslip.io',
  ...(process.env.CORS_ALLOWED_ORIGINS?.split(',').map((s) => s.trim()) ?? []),
]);

export const setupCors = (app: INestApplication): void => {
  const logger = new Logger('CORS');
  const isDev = process.env.NODE_ENV !== 'production';

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        isDev ||
        DEFAULT_ORIGINS.has(origin) ||
        DEFAULT_ORIGINS.has('*')
      ) {
        return callback(null, true);
      }
      logger.warn(`Blocked CORS request from origin: ${origin}`);
      return callback(
        new Error(`CORS Policy: Origin ${origin} not allowed`),
        false,
      );
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders:
      'Content-Type, Accept, Authorization, Apollo-Require-Preflight, x-apollo-operation-name, apollo-require-preflight',
  });
};
