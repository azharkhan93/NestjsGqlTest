import { INestApplication, Logger } from '@nestjs/common';

export const setupCors = (app: INestApplication): void => {
  const logger = new Logger('CORS');
  const isDev = process.env.NODE_ENV !== 'production';

  const allowedOrigins = new Set(
    (
      process.env.CORS_ALLOWED_ORIGINS?.split(',').map((s) => s.trim()) ?? []
    ).filter(Boolean),
  );

  if (isDev) {
    allowedOrigins.add('http://localhost:8080');
    allowedOrigins.add('http://localhost:3000');
    allowedOrigins.add('http://localhost:3001');
    allowedOrigins.add('http://localhost:8081');
    allowedOrigins.add('http://localhost:19006');
  }

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        isDev ||
        allowedOrigins.has(origin) ||
        allowedOrigins.has('*')
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
