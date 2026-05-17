import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateVendorProfileInput {
  @Field({ nullable: true })
  userId?: string;

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
}

@InputType()
export class UpdateVendorProfileInput {
  @Field({ nullable: true })
  businessName?: string;

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
}
