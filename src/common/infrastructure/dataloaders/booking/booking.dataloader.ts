import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { IBookingRepository } from '@modules/bookings/domain/repositories';
import { BookingEntity } from '@modules/bookings/domain/entities';

@Injectable({ scope: Scope.REQUEST })
export class BookingDataLoader {
  private readonly loader: DataLoader<string, BookingEntity | null>;

  constructor(private readonly bookingRepository: IBookingRepository) {
    this.loader = new DataLoader<string, BookingEntity | null>(
      async (bookingIds: readonly string[]) => {
        const bookings = await this.bookingRepository.findByIds([
          ...bookingIds,
        ]);
        const bookingMap = new Map<string, BookingEntity>();
        bookings.forEach((b) => {
          if (b) bookingMap.set(b.id, b);
        });
        return bookingIds.map((id) => bookingMap.get(id) ?? null);
      },
    );
  }

  async load(bookingId: string): Promise<BookingEntity | null> {
    return this.loader.load(bookingId);
  }
}
