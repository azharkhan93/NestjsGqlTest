import { Module } from '@nestjs/common';
import { PrismaModule } from '@common/infrastructure/persistence/prisma/prisma.module';
import { NotificationService } from './application/services/notification.service';
import { NotificationResolver } from './presentation/graphql/resolvers/notification.resolver';
import { FcmService } from './infrastructure/services/fcm.service';
import { IUserDeviceTokenRepository } from './domain/repositories/user-device-token.repository.interface';
import { INotificationRepository } from './domain/repositories/notification.repository.interface';
import { PrismaUserDeviceTokenRepository } from './infrastructure/persistence/prisma/prisma-user-device-token.repository';
import { PrismaNotificationRepository } from './infrastructure/persistence/prisma/prisma-notification.repository';

import { CommonModule } from '@common/common.module';

@Module({
  imports: [PrismaModule, CommonModule],
  providers: [
    NotificationService,
    NotificationResolver,
    FcmService,
    {
      provide: IUserDeviceTokenRepository,
      useClass: PrismaUserDeviceTokenRepository,
    },
    {
      provide: INotificationRepository,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationsModule {}
