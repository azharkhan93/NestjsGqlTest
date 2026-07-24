import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { BookingsService } from './application/services/bookings.service';
import { BookingsResolver } from './presentation/graphql/resolvers/bookings.resolver';

@Module({
  imports: [CommonModule],
  providers: [BookingsService, BookingsResolver],
  exports: [BookingsService],
})
export class BookingsModule {}
