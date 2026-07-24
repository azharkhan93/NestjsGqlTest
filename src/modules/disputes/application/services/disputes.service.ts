import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import { CreateDisputeInput } from '../../presentation/graphql/inputs/create-dispute.input';

@Injectable()
export class DisputesService {
  constructor(private readonly prisma: PrismaService) {}

  async createDispute(input: CreateDisputeInput) {
    return this.prisma.dispute.create({
      data: {
        bookingId: input.bookingId,
        reason: input.reason,
        status: 'OPEN',
      },
    });
  }

  async getDisputeByBookingId(bookingId: string) {
    return this.prisma.dispute.findUnique({
      where: { bookingId },
    });
  }
}
