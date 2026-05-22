import { Injectable, Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { TrackingSessionEntity } from '../../domain/entities/tracking-session.entity';

@Injectable()
export class TrackingService {
  private readonly sessions = new Map<string, TrackingSessionEntity>();

  constructor(@Inject('PUB_SUB') private readonly pubSub: PubSub) {}

  async updateLocation(
    bookingId: string,
    latitude: number,
    longitude: number,
    status: string,
    eta: number,
  ): Promise<TrackingSessionEntity> {
    const session = TrackingSessionEntity.create({
      bookingId,
      latitude,
      longitude,
      status,
      eta,
      updatedAt: new Date(),
    });

    this.sessions.set(bookingId, session);

    await this.pubSub.publish(`driverLocationUpdated:${bookingId}`, {
      driverLocationUpdated: session,
    });

    return session;
  }

  async getLocation(bookingId: string): Promise<TrackingSessionEntity | null> {
    return this.sessions.get(bookingId) || null;
  }
}
