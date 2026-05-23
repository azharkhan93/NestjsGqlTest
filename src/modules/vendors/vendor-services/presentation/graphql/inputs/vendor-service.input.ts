import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

@InputType()
export class ServicePricingInput {
  @Field(() => ID)
  categoryId: string;

  @Field(() => Float)
  price: number;
}

@InputType()
export class CreateVendorServiceInput {
  @Field(() => ID)
  vendorProfileId: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  duration: number;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => [String], { defaultValue: [] })
  features: string[];

  @Field(() => [String], { defaultValue: [] })
  images: string[];

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => Boolean, { defaultValue: true })
  availableAtHome: boolean;

  @Field(() => Boolean, { defaultValue: true })
  availableAtCenter: boolean;

  @Field(() => [ServicePricingInput], { nullable: true })
  pricings?: ServicePricingInput[];
}

@InputType()
export class UpdateVendorServiceInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Int, { nullable: true })
  duration?: number;

  @Field(() => String, { nullable: true })
  location?: string;

  @Field(() => [String], { nullable: true })
  features?: string[];

  @Field(() => [String], { nullable: true })
  images?: string[];

  @Field(() => ID, { nullable: true })
  categoryId?: string;

  @Field(() => Boolean, { nullable: true })
  availableAtHome?: boolean;

  @Field(() => Boolean, { nullable: true })
  availableAtCenter?: boolean;

  @Field(() => [ServicePricingInput], { nullable: true })
  pricings?: ServicePricingInput[];
}
