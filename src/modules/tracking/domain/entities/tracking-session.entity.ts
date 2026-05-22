import { BaseEntity } from '@common/domain/entities';

export class TrackingSessionEntity extends BaseEntity {
  bookingId: string;
  latitude: number;
  longitude: number;
  status: string;
  eta: number;

  constructor(partial: Partial<TrackingSessionEntity>) {
    super();
    Object.assign(this, partial);
  }

  static create(data: Partial<TrackingSessionEntity>): TrackingSessionEntity {
    return new TrackingSessionEntity({
      ...data,
      updatedAt: data.updatedAt || new Date(),
    });
  }
}
