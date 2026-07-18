import { INestApplication, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { softDeleteExtension } from './soft-delete.extension';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly extendedClient: PrismaClient;

  constructor() {
    super();
    this.extendedClient = this.$extends(
      softDeleteExtension(this),
    ) as unknown as PrismaClient;

    const customKeys = [
      'onModuleInit',
      'enableShutdownHooks',
      'extendedClient',
    ];

    return new Proxy(this, {
      get: (target, prop) => {
        if (customKeys.includes(prop as string)) {
          const val = Reflect.get(target, prop);
          if (typeof val === 'function') {
            return (val as (...args: unknown[]) => unknown).bind(target);
          }
          return val;
        }
        const val = Reflect.get(target.extendedClient, prop);
        if (typeof val === 'function') {
          return (val as (...args: unknown[]) => unknown).bind(
            target.extendedClient,
          );
        }
        return val;
      },
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }
}
