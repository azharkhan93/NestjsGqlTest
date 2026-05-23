import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType('ServicePricing')
export class ServicePricingType {
  @Field(() => ID)
  categoryId: string;

  @Field(() => Float)
  price: number;
}

@ObjectType('VendorService')
export class VendorServiceType {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  vendorProfileId: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string | null;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  duration: number;

  @Field(() => String, { nullable: true })
  location?: string | null;

  @Field(() => [String])
  features: string[];

  @Field(() => [String])
  images: string[];

  @Field(() => ID, { nullable: true })
  categoryId?: string | null;

  @Field(() => Boolean)
  availableAtHome: boolean;

  @Field(() => Boolean)
  availableAtCenter: boolean;

  @Field(() => [ServicePricingType], { nullable: true })
  pricings?: ServicePricingType[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
