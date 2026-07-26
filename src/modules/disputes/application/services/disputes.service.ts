import { Injectable } from '@nestjs/common';
import { IDisputeRepository } from '../../domain/repositories/dispute.repository.interface';
import { DisputeEntity } from '../../domain/entities/dispute.entity';
import { CreateDisputeInput } from '../../presentation/graphql/inputs/create-dispute.input';

@Injectable()
export class DisputesService {
  constructor(private readonly disputeRepository: IDisputeRepository) {}

  async createDispute(input: CreateDisputeInput): Promise<DisputeEntity> {
    const dispute = DisputeEntity.create({
      bookingId: input.bookingId,
      reason: input.reason,
      status: 'OPEN',
    });
    return this.disputeRepository.create(dispute);
  }

  async getDisputeByBookingId(
    bookingId: string,
  ): Promise<DisputeEntity | null> {
    return this.disputeRepository.findByBookingId(bookingId);
  }
}
