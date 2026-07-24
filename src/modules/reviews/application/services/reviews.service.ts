import { Injectable } from '@nestjs/common';
import { PrismaService } from '@common/infrastructure/persistence';
import { CreateReviewInput } from '../../presentation/graphql/inputs/create-review.input';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async createReview(input: CreateReviewInput) {
    return this.prisma.review.create({
      data: {
        bookingId: input.bookingId,
        rating: input.rating,
        comment: input.comment,
      },
    });
  }

  async getReviewByBookingId(bookingId: string) {
    return this.prisma.review.findUnique({
      where: { bookingId },
    });
  }

  async getVendorReviews(vendorProfileId: string) {
    return this.prisma.review.findMany({
      where: {
        booking: {
          service: {
            vendorProfileId,
          },
        },
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
