import { Module } from '@nestjs/common';
import { CommonModule } from '@common/common.module';
import { BookingService } from './application/services/booking.service';
import { BookingsResolver } from './presentation/graphql/resolvers/bookings.resolver';
import { IBookingRepository } from './domain/repositories';
import { BookingRepository } from './infrastructure/persistence/repositories';

@Module({
  imports: [CommonModule],
  providers: [
    BookingService,
    BookingsResolver,
    {
      provide: IBookingRepository,
      useClass: BookingRepository,
    },
  ],
  exports: [BookingService, IBookingRepository],
})
export class BookingsModule {}
