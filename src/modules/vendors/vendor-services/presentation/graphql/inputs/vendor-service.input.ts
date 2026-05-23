import { Field, Float, ID, InputType, Int } from '@nestjs/graphql';

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
}
