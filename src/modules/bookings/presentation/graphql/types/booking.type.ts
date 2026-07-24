import {
  Field,
  ID,
  ObjectType,
  registerEnumType,
  Float,
} from '@nestjs/graphql';
import { BookingStatus } from '@prisma/client';
import { VendorServiceType } from '../../../../vendors/vendor-services/presentation/graphql/types/vendor-service.type';
import { VendorProfileType } from '../../../../vendors/presentation/graphql/types/vendor-profile/vendor-profile.type';
import { UserType } from '../../../../users/presentation/graphql/types/user.type';

registerEnumType(BookingStatus, {
  name: 'BookingStatus',
  description: 'Status of the booking',
});

@ObjectType('Booking')
export class BookingType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field({ nullable: true })
  user?: UserType;

  @Field()
  serviceId: string;

  @Field(() => VendorServiceType, { nullable: true })
  service?: VendorServiceType;

  @Field(() => VendorProfileType, { nullable: true })
  vendorProfile?: VendorProfileType;

  @Field(() => BookingStatus)
  status: BookingStatus;

  @Field()
  scheduledAt: Date;

  @Field(() => Float, { nullable: true })
  totalPrice?: number;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
