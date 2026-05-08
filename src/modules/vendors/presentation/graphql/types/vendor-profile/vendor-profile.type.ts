import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class VendorProfileType {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  businessName: string;

  @Field({ nullable: true })
  imageUri?: string;

  @Field({ nullable: true })
  gstNumber?: string;

  @Field({ nullable: true })
  contactNumber?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  serviceRadius?: string;

  @Field({ nullable: true })
  operatingHours?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
