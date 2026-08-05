import { Injectable, Scope } from '@nestjs/common';
import { BaseDataLoader } from '../base.dataloader';
import { IBookingRepository } from '@modules/bookings/domain/repositories';
import { BookingEntity } from '@modules/bookings/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class BookingDataLoader extends BaseDataLoader<BookingEntity> {
  constructor(bookingRepository: IBookingRepository) {
    super(bookingRepository);
  }
}
